
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const About = () => {
  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">Kuhusu</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Info className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex justify-center mb-4">
            <div className="text-primary font-bold text-2xl">Kijumbe App</div>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-gray-500">Toleo la 1.0.0</div>
          </div>
          
          <p className="text-gray-600 mb-6 text-center">
            Kijumbe App ni programu ya kukusanya fedha kwa vikundi, iliyoundwa 
            kufanya michango ya kundi kuwa rahisi, salama na ya uwazi.
          </p>
          
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold mb-2">Watengenezaji</h3>
            <p className="text-gray-600">
              Programu hii imetengenezwa na timu ya wataalam kutoka Tanzania, 
              wakilenga kusaidia jamii kupata njia rahisi ya kushirikishana.
            </p>
          </div>
        </Card>
        
        <div className="space-y-4">
          <AboutLink
            title="Sera ya Faragha"
            description="Soma jinsi tunavyotunza data zako"
            linkTo="https://example.com/privacy"
          />
          
          <AboutLink
            title="Masharti ya Matumizi"
            description="Masharti ya huduma yetu"
            linkTo="https://example.com/terms"
          />
          
          <AboutLink
            title="Tovuti Rasmi"
            description="Tembelea tovuti yetu kuu"
            linkTo="https://example.com"
          />
          
          <AboutLink
            title="Media ya Kijamii"
            description="Fuata akaunti zetu za mitandao ya kijamii"
            linkTo="https://example.com/social"
          />
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-8">
          &copy; 2023-2025 Kijumbe App. Haki zote zimehifadhiwa.
        </div>
      </div>
    </AppLayout>
  );
};

interface AboutLinkProps {
  title: string;
  description: string;
  linkTo: string;
}

const AboutLink = ({ title, description, linkTo }: AboutLinkProps) => {
  return (
    <Card className="p-4">
      <a href={linkTo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ExternalLink className="h-5 w-5 text-gray-400" />
      </a>
    </Card>
  );
};

export default About;
