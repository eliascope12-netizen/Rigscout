import "../styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>RigScout — Analyze, build and upgrade your PC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*
          Deliberately does NOT say "live pricing". The site serves a dated
          catalog snapshot, so "live" would be false in every state it can be
          in — and a meta description is the one line that gets quoted back on
          Google and in every link preview, where nobody sees the caveat.
        */}
        <meta
          name="description"
          content="Find your PC's bottleneck, plan a compatible build, and buy the right upgrade. Compatibility checked for you, and every price dated on the page."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RigScout" />
        <meta property="og:title" content="RigScout — Analyze, build and upgrade your PC" />
        <meta
          property="og:description"
          content="Find out which part is holding your frame rate back, plan a build where everything fits, and see what the fix actually costs."
        />
        <meta name="twitter:card" content="summary" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
