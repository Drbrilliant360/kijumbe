
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const Help = () => {
  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">Msaada</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-2">Maswali Yanayoulizwa Mara kwa Mara</h2>
          <p className="text-gray-600 mb-4">Pata majibu ya maswali yanayoulizwa mara kwa mara</p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Kijumbe App ni nini?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Kijumbe App ni programu ya simu ya kidijitali inayokuwezesha 
                kuunganisha na kukusanya pesa pamoja na wengine. Ni njia rahisi 
                na salama ya kukusanya michango na kudhibiti fedha za vikundi.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Vipi ninaunda kikundi kipya?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Kwa kuunda kikundi kipya, fungua ukurasa wa Vikundi, bonyeza kitufe 
                cha "Unda Kikundi", jaza maelezo yanayohitajika kama vile jina la 
                kikundi, maelezo, na idadi ya wanachama. Kisha bonyeza "Tuma" na 
                kikundi kitaundwa mara moja.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Ninawezaje kuwaalika watu kwenye kikundi changu?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Unaweza kuwaalika wanachama wapya kwenye kikundi chako kwa kubofya 
                kitufe cha "Shiriki" kwenye kikundi chako. Hii itatoa kiungo 
                ambacho unaweza kutuma kwa watu unaotaka kujiunga na kikundi chako.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Jinsi gani ninaweza kutoa pesa?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Kutoa pesa, nenda kwenye ukurasa wa Malipo, chagua "Toa Pesa", na 
                fuata maelekezo. Unaweza kutoa pesa kwenye akaunti yako ya benki 
                au pochi la simu.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Kuna ada ya kutumia programu?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Kutumia programu msingi ni bure. Hata hivyo, baadhi ya huduma za 
                ziada zinaweza kuwa na malipo madogo. Pia, ada za kawaida za mtoa 
                huduma wa malipo (kama vile M-Pesa au benki) bado zitatumika.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Wasiliana Nasi</h2>
          <p className="text-gray-600 mb-4">Una swali zaidi? Wasiliana nasi moja kwa moja</p>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Zungumza na Msaidizi
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2 h-4 w-4"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Tuma Barua Pepe
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2 h-4 w-4"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help;
