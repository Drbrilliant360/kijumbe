
import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Smartphone, ArrowLeft, Laptop, Tablet, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Device {
  id: string;
  name: string;
  type: "phone" | "tablet" | "laptop";
  lastActive: string;
  isCurrentDevice: boolean;
}

const ManageDevices = () => {
  const { t } = useTranslations();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching devices
    setTimeout(() => {
      setDevices([
        {
          id: "1",
          name: "iPhone 13",
          type: "phone",
          lastActive: "Sasa hivi",
          isCurrentDevice: true
        },
        {
          id: "2",
          name: "MacBook Pro",
          type: "laptop",
          lastActive: "Jana, 15:30",
          isCurrentDevice: false
        },
        {
          id: "3",
          name: "iPad Mini",
          type: "tablet",
          lastActive: "Jumatatu, 09:45",
          isCurrentDevice: false
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleLogoutDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    toast.success("Kifaa kimetolewa!");
  };
  
  const getDeviceIcon = (type: string) => {
    switch(type) {
      case "phone":
        return <Smartphone className="h-6 w-6" />;
      case "laptop":
        return <Laptop className="h-6 w-6" />;
      case "tablet":
        return <Tablet className="h-6 w-6" />;
      default:
        return <Smartphone className="h-6 w-6" />;
    }
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('manageDevicesTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('manageDevicesTitle')}</h2>
          <p className="text-gray-500 text-center">{t('manageDevicesDesc')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="font-bold text-lg p-4 border-b">Vifaa Vilivyoingia</h3>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Inapakia vifaa...</p>
            </div>
          ) : (
            <div className="divide-y">
              {devices.map(device => (
                <div key={device.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{device.name}</p>
                          {device.isCurrentDevice && (
                            <span className="ml-2 inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                              <Check className="h-3 w-3 mr-1" />
                              Kifaa hiki
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Mwisho: {device.lastActive}</p>
                      </div>
                    </div>
                    
                    {!device.isCurrentDevice && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleLogoutDevice(device.id)}
                      >
                        Toa
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {devices.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Hakuna vifaa vilivyoingia.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <Link to="/mpangilio/logout-all">
            <Button variant="outline" className="w-full">
              Toka kwenye Vifaa Vyote
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default ManageDevices;
