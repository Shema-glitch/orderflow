
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderCardSkeleton() {
  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-6 w-6" />
        </div>
        
        <div className="mt-4">
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
