import Link from "next/link";
import { Star, BadgeCheck } from "lucide-react";

interface BusinessProps {
  id: number;
  name: string;
  category: string;
  score: number;
  reviewCount: number;
}

export default function BusinessCard({ id, name, category, score, reviewCount }: BusinessProps) {
  return (
    <Link href={`/business/${id}`} className="group block">
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md mb-2">
              {category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {name}
            </h3>
          </div>
          {/* Credo Score Badge */}
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 font-bold text-lg ${score > 70 ? 'text-green-600' : 'text-indigo-600'}`}>
              <BadgeCheck className="w-5 h-5" />
              {score}
            </div>
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Credo Score</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{reviewCount > 0 ? `${reviewCount} Reviews` : 'New Business'}</span>
        </div>
      </div>
    </Link>
  );
}