"use client";

import {useEffect, useState} from "react";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "../ui/button";
import {createTransaction} from "@/lib/actions/transaction.action";
import CryptoPayment from '@/components/blockchain/CryptoPayment'
import FramerModal from "@/components/shared/FramerModal";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });
    }

    if (query.get("canceled")) {
      toast({
        title: "Order canceled!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });
    }
  }, []);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };
    openModal();
  };

  const onSuccess = async (data: any) => {
    const blockChainTxId: string = data.hash;
    const transaction = {
      blockChainTxId,
      plan,
      amount,
      credits,
      buyerId,
    };
    console.log(transaction);
    try {
      await createTransaction(transaction as CreateTransactionParams);
      toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }
  const onFail = async (error: any) => {
    toast({
      title: "Order canceled!",
      description: "Continue to shop around and checkout when you're ready",
      duration: 5000,
      className: "error-toast",
    });
  }


  return (
      <form action={onCheckout} method="POST">
        <section>
          <Button
              type="submit"
              role="link"
              className="w-full rounded-full bg-purple-gradient bg-cover"
          >
            Buy Credit
          </Button>
        </section>
        <FramerModal isOpen={isOpen} onClose={closeModal}>
          <CryptoPayment amount={amount} onSuccess={onSuccess} onFail={onFail}/>
        </FramerModal>
      </form>

  );
};

export default Checkout;