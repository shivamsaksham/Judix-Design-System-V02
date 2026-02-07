import { Skeleton } from "@/components/ui/skeleton";

export const BotMessageSkeleton = () => {
    return (
        <div className="max-w-[1024px] w-full mx-auto px-4 mt-6">
            <div className="flex flex-col gap-4">
                {/* Result count skeletons */}
                <div className="flex gap-4 mb-6">
                    <Skeleton className="h-24 w-48 rounded-lg" />
                    <Skeleton className="h-24 w-48 rounded-lg" />
                </div>

                {/* Text content skeletons */}
                <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                </div>

                {/* More text content */}
                <div className="space-y-3 mt-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
        </div>
    );
};
