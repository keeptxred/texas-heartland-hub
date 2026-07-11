import React from "react";


interface CalculatorErrorBoundaryProps {

  children: React.ReactNode;

  fallbackTitle?: string;

  fallbackMessage?: string;

}



interface CalculatorErrorBoundaryState {

  hasError: boolean;

}



export default class CalculatorErrorBoundary extends React.Component<

  CalculatorErrorBoundaryProps,

  CalculatorErrorBoundaryState

> {


  constructor(
    props: CalculatorErrorBoundaryProps
  ) {

    super(props);


    this.state = {

      hasError: false,

    };

  }



  static getDerivedStateFromError() {

    return {

      hasError: true,

    };

  }



  componentDidCatch(
    error: Error
  ) {


    if (
      typeof window !== "undefined"
    ) {


      window.dispatchEvent(

        new CustomEvent(

          "calculator-error",

          {

            detail: {

              message:
                error.message,

              timestamp:
                new Date().toISOString(),

            },

          }

        )

      );

    }

  }




  handleRetry = () => {

    this.setState({

      hasError: false,

    });

  };




  render() {


    if (
      this.state.hasError
    ) {


      return (

        <section className="rounded-xl border bg-white p-8 text-center shadow-sm">


          <div className="mx-auto max-w-md">


            <h2 className="text-2xl font-bold text-gray-900">

              {this.props.fallbackTitle ||

                "Calculator Error"}

            </h2>



            <p className="mt-3 text-gray-600">

              {this.props.fallbackMessage ||

                "Something went wrong while loading this calculator. Please try again."}

            </p>



            <button

              onClick={this.handleRetry}

              className="mt-6 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"

            >

              Reload Calculator

            </button>


          </div>


        </section>

      );

    }



    return this.props.children;

  }

}