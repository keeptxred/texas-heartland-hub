#!/usr/bin/env python3
"""Contract tests for production representative smoke: full-body validation only."""
import http.client
import importlib.util
import io
from pathlib import Path
import unittest
from unittest.mock import patch
import urllib.error


SCRIPT = Path(__file__).with_name("verify-representative-pilot-production.py")
spec = importlib.util.spec_from_file_location("representative_production_smoke", SCRIPT)
smoke = importlib.util.module_from_spec(spec)
spec.loader.exec_module(smoke)


class Response:
    def __init__(self, status: int, body: bytes, declared_size: int | None = None):
        self.status = status
        self.body = body
        self.headers = {"Content-Length": str(
            len(body) if declared_size is None else declared_size
        )}

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        return self.body


class RepresentativeTransportTests(unittest.TestCase):
    def test_returns_complete_response_unchanged(self):
        with patch.object(smoke.urllib.request, "urlopen", return_value=Response(
            200, b"<html>expected complete page</html>"
        )) as request:
            self.assertEqual(
                smoke.get("/representatives/bryan-hughes"),
                (200, "<html>expected complete page</html>"),
            )
            self.assertEqual(request.call_count, 1)

    def test_one_interrupted_read_refetches_whole_document(self):
        with patch.object(smoke.urllib.request, "urlopen", side_effect=[
            http.client.IncompleteRead(b"partial", 15000),
            Response(200, b"complete SSR HTML"),
        ]) as request, patch.object(smoke.time, "sleep") as pause:
            self.assertEqual(
                smoke.get("/representatives/shelley-luther"),
                (200, "complete SSR HTML"),
            )
            self.assertEqual(request.call_count, 2)
            pause.assert_called_once_with(0.5)

    def test_content_length_mismatch_does_not_pass_with_partial_html(self):
        with patch.object(smoke.urllib.request, "urlopen", return_value=Response(
            200, b"partial", declared_size=32766
        )) as request, patch.object(smoke.time, "sleep"):
            with self.assertRaisesRegex(AssertionError, "interrupted HTTP response after 3"):
                smoke.get("/representatives/mitch-little")
            self.assertEqual(request.call_count, 3)

    def test_permanent_incomplete_read_still_fails_certification(self):
        with patch.object(smoke.urllib.request, "urlopen", side_effect=
            http.client.IncompleteRead(b"partial", 200)
        ) as request, patch.object(smoke.time, "sleep"):
            with self.assertRaisesRegex(AssertionError, "interrupted HTTP response after 3"):
                smoke.get("/representatives/mitch-little")
            self.assertEqual(request.call_count, 3)

    def test_unexpected_http_status_is_never_retried_or_rewritten_as_200(self):
        missing = urllib.error.HTTPError(
            "https://keeptxred.com/representatives/shelley-luther", 404,
            "Not Found", {}, io.BytesIO(b"404 profile missing")
        )
        with patch.object(smoke.urllib.request, "urlopen", side_effect=missing) as request:
            self.assertEqual(
                smoke.get("/representatives/shelley-luther"),
                (404, "404 profile missing"),
            )
            self.assertEqual(request.call_count, 1)


if __name__ == "__main__":
    unittest.main()
