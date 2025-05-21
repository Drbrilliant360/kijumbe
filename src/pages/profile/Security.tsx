
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Key, Shield, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Security = () => {
  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">Usalama</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <SecurityOption 
            icon={<Key className="h-5 w-5" />}
            title="Badilisha Nywila" 
            description="Weka nywila mpya yenye nguvu zaidi"
            linkTo="/mpangilio/password"
          />
          
          <SecurityOption 
            icon={<Shield className="h-5 w-5" />}
            title="Uthibitishaji wa Hatua Mbili" 
            description="Ongeza safu ya ulinzi kwa akaunti yako"
            linkTo="/mpangilio/two-factor"
          />
          
          <SecurityOption 
            icon={<Smartphone className="h-5 w-5" />}
            title="Vifaa Vilivyounganishwa" 
            description="Dhibiti vifaa ambavyo vimeingia kwenye akaunti yako"
            linkTo="/mpangilio/devices"
          />
          
          <SecurityOption 
            icon={<Lock className="h-5 w-5" />}
            title="Toka Vifaa Vyote" 
            description="Toka kutoka kila kifaa kilichounganishwa na akaunti yako"
            linkTo="/mpangilio/logout-all"
            variant="destructive"
          />
        </div>
      </div>
    </AppLayout>
  );
};

interface SecurityOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  variant?: "default" | "destructive";
}

const SecurityOption = ({ icon, title, description, linkTo, variant = "default" }: SecurityOptionProps) => {
  return (
    <Card className="p-4">
      <Link to={linkTo} className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full mr-4 ${variant === "destructive" ? "bg-red-100" : "bg-secondary"}`}>
            <div className={variant === "destructive" ? "text-red-600" : "text-primary"}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className={`font-medium ${variant === "destructive" ? "text-red-600" : ""}`}>{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
      </Link>
    </Card>
  );
};

export default Security;
