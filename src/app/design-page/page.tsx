"use client";
import { Button } from "@/app/components";

export default function DesignSystem() {
  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">🎨 Design System</h1>
        <p className="text-gray-500">Component documentation and preview</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="p-6 border rounded-xl bg-white flex gap-4 items-center">
          <Button label="Primary Button" variant="primary" onClick={() => alert('Primary Clicked')} />
          <Button label="Secondary Button" variant="secondary" />
          <Button label="Danger Button" variant="danger" />
        </div>
      </section>
    </div>
  );
}