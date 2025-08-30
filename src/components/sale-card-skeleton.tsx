
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SaleCardSkeleton() {
  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className='flex-1 flex items-center space-x-4'>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
