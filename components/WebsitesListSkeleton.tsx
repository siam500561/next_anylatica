export function WebsitesListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
