import Image from "next/image";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-24">
      <div>
        <Image
          src={"/shared/bridgepay-logo-base.svg"}
          alt="BridgePay Logo"
          width={200}
          height={200}
          className="mx-auto w-[120px] h-auto"
        />
        <h1>You are offline</h1>
        <p>Please check your internet connection.</p>
      </div>
    </main>
  );
}
