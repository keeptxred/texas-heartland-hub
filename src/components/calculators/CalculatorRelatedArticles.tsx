import React from "react";


interface RelatedArticle {

  title: string;

  description: string;

  url: string;

}



interface CalculatorRelatedArticlesProps {

  articles: RelatedArticle[];

}



export default function CalculatorRelatedArticles({

  articles,

}: CalculatorRelatedArticlesProps) {


  if (!articles.length) {

    return null;

  }



  return (

    <section className="mt-10 rounded-xl border bg-white p-6 shadow-sm">


      <h2 className="text-2xl font-bold text-gray-900">

        Related Texas Guides

      </h2>



      <p className="mt-2 text-gray-600">

        Learn more about Texas housing,
        taxes, relocation, and financial planning.

      </p>



      <div className="mt-6 grid gap-5 md:grid-cols-2">


        {articles.map(

          (article, index) => (

            <a

              key={index}

              href={article.url}

              className="rounded-lg border p-5 transition hover:bg-gray-50"

            >

              <h3 className="font-semibold text-gray-900">

                {article.title}

              </h3>



              <p className="mt-2 text-sm text-gray-600">

                {article.description}

              </p>


            </a>

          )

        )}


      </div>


    </section>

  );

}