import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ current }) => (
  <div className="text-sm breadcrumbs flex items-center gap-2 text-gray-600 mb-4">
    <span>Trang chủ</span>
    <ChevronRight size={16} />
    <span className="font-medium">{current}</span>
  </div>
);

export default Breadcrumb;
