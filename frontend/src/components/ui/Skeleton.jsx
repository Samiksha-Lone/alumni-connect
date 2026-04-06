import React from 'react';

export default function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-3xl p-8 space-y-4">
      <Skeleton className="w-16 h-16 rounded-2xl" />
      <Skeleton className="w-3/4 h-6" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
      </div>
      <div className="pt-4 flex gap-2">
        <Skeleton className="flex-1 h-10 rounded-xl" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-3xl" />
        <div className="space-y-3">
          <Skeleton className="w-48 h-10" />
          <Skeleton className="w-32 h-6" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Skeleton className="w-full h-[400px] rounded-3xl" />
        </div>
        <Skeleton className="w-full h-[300px] rounded-3xl" />
      </div>
    </div>
  );
}
