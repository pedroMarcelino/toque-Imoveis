import { Link } from "wouter";
import { Compass } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div>
      <div className="bg-[#eaf4f7]">
        <Header />
        <div className="container pb-16 pt-40 text-center">
          <Compass size={48} className="mx-auto text-primary" />
          <h1 className="mt-6 font-display text-6xl font-semibold text-slate-900">
            404
          </h1>
          <p className="mt-3 text-slate-600">
            Ops! A página que você procura não foi encontrada.
          </p>
          <Link href="/">
            <a>
              <Button className="mt-8 rounded-2xl bg-primary px-8">
                Voltar ao início
              </Button>
            </a>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}