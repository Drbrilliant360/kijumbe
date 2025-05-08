
import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
}

const BankAccounts = () => {
  const { t } = useTranslations();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBankName, setNewBankName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  useEffect(() => {
    // Simulate fetching accounts
    setTimeout(() => {
      setAccounts([
        {
          id: "1",
          bankName: "CRDB Bank",
          accountNumber: "0152000XXX",
          accountName: "John Doe",
          isPrimary: true
        },
        {
          id: "2",
          bankName: "NMB Bank",
          accountNumber: "2010XXX",
          accountName: "John Doe",
          isPrimary: false
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAccount: BankAccount = {
        id: Date.now().toString(),
        bankName: newBankName,
        accountNumber: newAccountNumber,
        accountName: newAccountName,
        isPrimary: accounts.length === 0
      };
      
      setAccounts([...accounts, newAccount]);
      setNewBankName("");
      setNewAccountNumber("");
      setNewAccountName("");
      setIsSaving(false);
      setSheetOpen(false);
      toast.success("Akaunti ya benki imeongezwa!");
    }, 1000);
  };
  
  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
    toast.success("Akaunti ya benki imeondolewa!");
  };
  
  const handleSetPrimary = (accountId: string) => {
    setAccounts(accounts.map(account => ({
      ...account,
      isPrimary: account.id === accountId
    })));
    toast.success("Akaunti kuu imewekwa!");
  };

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/mpangilio">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{t('bankAccountsTitle')}</h1>
    </div>
  );
  
  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t('bankAccountsTitle')}</h2>
          <p className="text-gray-500 text-center">{t('bankAccountsDesc')}</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500">Inapakia akaunti...</p>
            </div>
          ) : (
            <>
              {accounts.map(account => (
                <Card key={account.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg">{account.bankName}</h3>
                        {account.isPrimary && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Akaunti Kuu
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{account.accountNumber}</p>
                      <p className="text-sm text-gray-500">{account.accountName}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {!account.isPrimary && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetPrimary(account.id)}
                      >
                        Weka kama Akaunti Kuu
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
              
              {accounts.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500 mb-4">Hakuna akaunti za benki zilizosajiliwa.</p>
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button>
                        <Plus className="h-5 w-5 mr-2" />
                        Ongeza Akaunti ya Benki
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Ongeza Akaunti ya Benki</SheetTitle>
                      </SheetHeader>
                      
                      <div className="py-6">
                        <form onSubmit={handleAddAccount} className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="bankName" className="block text-sm font-medium">
                              Jina la Benki
                            </label>
                            <Input
                              id="bankName"
                              value={newBankName}
                              onChange={(e) => setNewBankName(e.target.value)}
                              placeholder="CRDB, NMB, etc."
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="accountNumber" className="block text-sm font-medium">
                              Namba ya Akaunti
                            </label>
                            <Input
                              id="accountNumber"
                              value={newAccountNumber}
                              onChange={(e) => setNewAccountNumber(e.target.value)}
                              placeholder="9876543210"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="accountName" className="block text-sm font-medium">
                              Jina la Akaunti
                            </label>
                            <Input
                              id="accountName"
                              value={newAccountName}
                              onChange={(e) => setNewAccountName(e.target.value)}
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          
                          <div className="pt-4">
                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={isSaving}
                            >
                              {isSaving ? "Inahifadhi..." : "Ongeza Akaunti"}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </>
          )}
          
          {!isLoading && accounts.length > 0 && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-5 w-5 mr-2" />
                  Ongeza Akaunti ya Benki
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Ongeza Akaunti ya Benki</SheetTitle>
                </SheetHeader>
                
                <div className="py-6">
                  <form onSubmit={handleAddAccount} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="bankName" className="block text-sm font-medium">
                        Jina la Benki
                      </label>
                      <Input
                        id="bankName"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        placeholder="CRDB, NMB, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="accountNumber" className="block text-sm font-medium">
                        Namba ya Akaunti
                      </label>
                      <Input
                        id="accountNumber"
                        value={newAccountNumber}
                        onChange={(e) => setNewAccountNumber(e.target.value)}
                        placeholder="9876543210"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="accountName" className="block text-sm font-medium">
                        Jina la Akaunti
                      </label>
                      <Input
                        id="accountName"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSaving}
                      >
                        {isSaving ? "Inahifadhi..." : "Ongeza Akaunti"}
                      </Button>
                    </div>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default BankAccounts;
