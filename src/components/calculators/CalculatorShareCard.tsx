import React, {
  useState,
} from "react";

import {
  trackResultsShared,
} from "@/lib/analytics/calculatorAnalytics";


interface CalculatorShareCardProps {

  calculatorName: string;

  shareText: string;

  url?: string;

}



export default function CalculatorShareCard({

  calculatorName,

  shareText,

  url = window.location.href,

}: CalculatorShareCardProps) {


  const [copied, setCopied] =
    useState(false);



  async function copyResults() {

    try {

      await navigator.clipboard.writeText(

        `${shareText}\n\n${url}`

      );


      setCopied(true);


      setTimeout(

        () =>
          setCopied(false),

        2000

      );


      trackResultsShared(
        calculatorName
      );


    } catch {

      setCopied(false);

    }

  }



  async function nativeShare() {


    if (

      navigator.share

    ) {


      await navigator.share({

        title:
          calculatorName,

        text:
          shareText,

        url,

      });


      trackResultsShared(
        calculatorName
      );


      return;

    }


    copyResults();

  }





  const encodedText =
    encodeURIComponent(
      shareText
    );


  const encodedUrl =
    encodeURIComponent(
      url
    );



  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">


      <h2 className="text-xl font-bold text-gray-900">

        Share Your Results

      </h2>


      <p className="mt-2 text-sm text-gray-600">

        Save your estimate or share it with family,
        lenders, or anyone planning a move to Texas.

      </p>



      <div className="mt-5 flex flex-wrap gap-3">


        <button

          onClick={copyResults}

          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"

        >

          {copied
            ? "Copied!"
            : "Copy Results"}

        </button>



        <button

          onClick={nativeShare}

          className="rounded-lg border px-4 py-2 text-sm font-medium"

        >

          Share

        </button>



        <a

          href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}

          target="_blank"

          rel="noopener noreferrer"

          className="rounded-lg border px-4 py-2 text-sm font-medium"

        >

          Post on X

        </a>



        <a

          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}

          target="_blank"

          rel="noopener noreferrer"

          className="rounded-lg border px-4 py-2 text-sm font-medium"

        >

          Facebook

        </a>


      </div>


    </section>

  );

}