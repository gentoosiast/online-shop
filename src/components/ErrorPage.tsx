import React from "react";
import { useRouteError, Link } from "react-router-dom";

type RouteError = {
  statusText?: string;
  message?: string;
}

export const ErrorPage = () => {
  const error = useRouteError() as RouteError;

  return (
    <div id="error-page" className="h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p>Sorry an unexpected error has occured.</p>
        <p>
          <i>{error?.statusText || error?.message}</i>
        </p>
        <Link to="/" className="button button-add">Home</Link>
      </div>
    </div>
  );
}
