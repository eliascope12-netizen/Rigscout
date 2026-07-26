import "../styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>RigScout — Analyze, build and upgrade your PC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Find your PC's bottleneck, plan a compatible build, and buy the right upgrade — with live Amazon pricing." />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
