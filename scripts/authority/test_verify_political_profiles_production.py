#!/usr/bin/env python3
"""Pure unit tests: real political-profile production checks must survive transient HTTP truncation."""

from __future__ import annotations

import http.client
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch


SCRIPT = Path(__file__).with_name("verify-political-profiles-production.py")
SPEC = importlib.util.spec_from_file_location("ktr_political_profile_smoke", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
smoke = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(smoke)


class FakeResponse:
    status = 200
    headers = {"Content-Type": "image/png"}

    def __init__(self, body: bytes = b"valid-complete-body", *, incomplete: bool = False):
        self.body = body
        self.incomplete = incomplete

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        if self.incomplete:
            raise http.client.IncompleteRead(partial=b"partial-image", expected=451061)
        return self.body


class ProfileSmokeFetchTest(unittest.TestCase):
    def test_retries_transient_incomplete_hero_response_and_reads_complete_body(self):
        with patch.object(smoke.time, "sleep", return_value=None) as wait:
            with patch.object(smoke.urllib.request, "urlopen", side_effect=[
                FakeResponse(incomplete=True), FakeResponse(body=b"complete-image")
            ]) as urlopen:
                body, headers = smoke.fetch("/images/texas-political-figure.png")
        self.assertEqual(body, b"complete-image")
        self.assertEqual(headers["content-type"], "image/png")
        self.assertEqual(urlopen.call_count, 2)
        wait.assert_called_once_with(smoke.RETRY_SECONDS)

    def test_retries_remote_disconnect_then_verifies_200_image_content(self):
        with patch.object(smoke.time, "sleep", return_value=None):
            with patch.object(smoke.urllib.request, "urlopen", side_effect=[
                http.client.RemoteDisconnected("remote closed connection"),
                FakeResponse(body=b"complete-image"),
            ]) as urlopen:
                smoke.verify_image("/images/texas-political-figure.png", "/texas-politics/figures/test")
        self.assertEqual(urlopen.call_count, 2)

    def test_repeated_truncation_still_fails_required_production_smoke(self):
        with patch.object(smoke.time, "sleep", return_value=None) as wait:
            with patch.object(smoke.urllib.request, "urlopen",
                              side_effect=[FakeResponse(incomplete=True) for _ in range(smoke.ATTEMPTS)]) as urlopen:
                with self.assertRaisesRegex(smoke.VerificationFailure, "Unable to fetch"):
                    smoke.fetch("/images/texas-political-figure.png")
        self.assertEqual(urlopen.call_count, smoke.ATTEMPTS)
        self.assertEqual(wait.call_count, smoke.ATTEMPTS - 1)

    def test_wrong_content_type_still_fails_after_successful_download(self):
        class FakeHTML(FakeResponse):
            headers = {"Content-Type": "text/html"}

        with patch.object(smoke.urllib.request, "urlopen", return_value=FakeHTML()):
            with self.assertRaisesRegex(smoke.VerificationFailure, "hero content-type"):
                smoke.verify_image("/images/texas-political-figure.png", "/texas-politics/figures/test")


if __name__ == "__main__":
    unittest.main()
