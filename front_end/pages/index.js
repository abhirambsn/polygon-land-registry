import Head from "next/head";
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      <Head>
        <title>Heptagon Land Registry | Home</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar />
        <hr />
      </div>
      <section className="flex flex-col h-full w-full space-y-4">
        <div className="flex items-center justify-around">
          <img src="/assets/hero_1.svg" className="h-96 w-96" />
          <div className="flex flex-col space-y-4">
            <h4 className="text-center text-2xl md:text-3xl lg:text-5xl">
              Heptagon Land Registry Portal
            </h4>
            <span className="text-center text-lg md:text-xl lg:text-2xl">
              Simplified Land Registry, But on Blockchain :)
            </span>
          </div>
          <img src="/assets/hero_2.svg" className="h-96 w-96" />
        </div>
        <hr />
        <div className="flex items-center justify-around space-x-10 m-24">
          <img src="/assets/eth_blockchain.svg" className="h-96 w-96" />
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-center font-medium text-4xl">
              Powered by Blokchain
            </h3>
            <span>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
              asperiores eaque repellendus sequi corporis architecto,
              reprehenderit voluptates magni! Ipsam quo inventore illo magnam
              quos quam quasi nostrum accusantium commodi asperiores? Corporis,
              in architecto obcaecati mollitia cum optio pariatur aliquam sint
              ullam reiciendis molestias molestiae deserunt animi a tempora
              labore provident nesciunt officiis hic ea id quidem! Molestiae ad
              iure quod officiis, optio distinctio corrupti sint possimus
              voluptatem fugit assumenda cupiditate porro dolores, iste
              praesentium non soluta impedit, magnam cum vel vero ducimus natus.
              Perferendis dignissimos iusto laborum id! Provident at, illo esse
              quia accusamus tempora soluta ad tempore commodi consequuntur.
            </span>
          </div>
        </div>
        <div className="flex items-center justify-around space-x-10 m-24">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-center font-medium text-4xl">
              Easy Tracability
            </h3>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              temporibus, natus aut in similique recusandae assumenda?
              Temporibus corporis ut quis, iusto provident nesciunt nulla
              perferendis, ipsum, libero perspiciatis explicabo? Aliquid, quis
              corporis! Perspiciatis nemo accusamus minima magnam delectus cum
              quidem!
            </span>
          </div>
          <img src="/assets/map.svg" className="h-96 w-96" />
        </div>
      </section>
      <Footer />
    </div>
  );
}
