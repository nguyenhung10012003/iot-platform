import { Button } from '@repo/ui/components/ui/button';
import {
  ArrowRight,
  Cloud,
  Droplet,
  Leaf,
  LineChart,
  Thermometer,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">AgroIoT</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Tính năng
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              Cách hoạt động
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Bảng giá
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-primary"
            >
              Liên hệ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-medium hover:text-primary"
            >
              Đăng nhập
            </Link>
            <Button asChild>
              <Link href="/register">Dùng thử miễn phí</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Quản lý nông nghiệp thông minh với IoT
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Tối ưu hóa năng suất, tiết kiệm chi phí và tăng hiệu quả với
                    hệ thống quản lý nông nghiệp thông minh dựa trên IoT.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Bắt đầu ngay
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#demo">Xem demo</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                <Image
                  src="/image/landing1.jpg"
                  alt="Hệ thống IoT nông nghiệp"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-800/30 dark:text-green-400">
                  Tính năng
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Giải pháp toàn diện cho nông nghiệp thông minh
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Hệ thống của chúng tôi cung cấp đầy đủ các công cụ cần thiết
                  để quản lý nông nghiệp hiệu quả
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-800/30">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Điều khiển thiết bị IoT</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Tạo và kết nối để điều khiển các thiết bị IoT trong quản lý
                  nông nghiệp theo từng khu vực
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-800/30">
                  <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Tự động hóa</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Thiết lập quy trình tự động hóa thông minh dựa trên dữ liệu
                  thời gian thực và điều kiện môi trường
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-800/30">
                  <Leaf className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold">Dự đoán sâu bệnh</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Sử dụng AI để dự đoán và cảnh báo sớm về nguy cơ sâu bệnh,
                  giúp can thiệp kịp thời
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-cyan-100 p-3 dark:bg-cyan-800/30">
                  <Droplet className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold">Dự đoán tưới nước</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Phân tích dữ liệu để dự đoán nhu cầu tưới nước, tối ưu hóa sử
                  dụng nước và tiết kiệm chi phí
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-800/30">
                  <Thermometer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Theo dõi môi trường</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Ghi lại và phân tích các thông số môi trường như độ ẩm, gió,
                  lượng mưa, nhiệt độ theo thời gian thực
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-800/30">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold">Quản lý nhân sự</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Thêm người làm vào khu vực, tạo và giao các nhiệm vụ, theo dõi
                  tiến độ công việc
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-800/30 dark:text-blue-400">
                  Cách hoạt động
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Quy trình đơn giản, hiệu quả cao
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Chỉ với vài bước đơn giản, bạn có thể thiết lập và vận hành hệ
                  thống quản lý nông nghiệp thông minh
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12">
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-400">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Thiết lập khu vực</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Tạo và định nghĩa các khu vực canh tác của bạn trên bản đồ
                    số, thiết lập ranh giới và đặc điểm
                  </p>
                </div>
                <div className="h-[200px] w-full rounded-lg bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  <Image
                    src="/image/feat1.jpg"
                    alt="Thiết lập khu vực"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-400">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Kết nối thiết bị IoT</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Thêm và kết nối các thiết bị IoT vào hệ thống, thiết lập cấu
                    hình và vị trí
                  </p>
                </div>
                <div className="h-[200px] w-full rounded-lg bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  <Image
                    src="/image/feat2.jpg"
                    alt="Kết nối thiết bị IoT"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-400">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Thiết lập tự động hóa</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Tạo các quy tắc tự động hóa dựa trên dữ liệu và điều kiện
                    môi trường
                  </p>
                </div>
                <div className="h-[200px] w-full rounded-lg bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  <Image
                    src="/image/feat3.jpg"
                    alt="Thiết lập tự động hóa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-400">
                  <span className="text-xl font-bold">4</span>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Theo dõi và phân tích</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Giám sát dữ liệu thời gian thực, nhận thông báo và phân tích
                    xu hướng
                  </p>
                </div>
                <div className="h-[200px] w-full rounded-lg bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  <Image
                    src="/image/feat4.jpg"
                    alt="Theo dõi và phân tích"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="dashboard"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-800/30 dark:text-green-400">
                    Bảng điều khiển
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Theo dõi mọi thông số quan trọng
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Bảng điều khiển trực quan giúp bạn nắm bắt mọi thông số quan
                    trọng của trang trại trong thời gian thực
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-green-600" />
                    <span>
                      Biểu đồ theo dõi nhiệt độ, độ ẩm, ánh sáng theo thời gian
                      thực
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-green-600" />
                    <span>Cảnh báo khi các thông số vượt ngưỡng an toàn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-green-600" />
                    <span>
                      Dự báo nhu cầu tưới nước dựa trên dữ liệu thời tiết và độ
                      ẩm đất
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>
                      Quản lý nhân sự và phân công nhiệm vụ trực tiếp từ bảng
                      điều khiển
                    </span>
                  </li>
                </ul>
                <div>
                  <Button size="lg" asChild>
                    <Link href="/demo">
                      Xem demo bảng điều khiển
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border shadow-lg">
                <Image
                  src="/image/landing2.jpg"
                  alt="Bảng điều khiển IoT nông nghiệp"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-800/30 dark:text-blue-400">
                  Bảng giá
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Lựa chọn phù hợp với nhu cầu của bạn
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Chúng tôi cung cấp nhiều gói dịch vụ khác nhau để phù hợp với
                  quy mô và nhu cầu của trang trại bạn
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Cơ bản</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Dành cho trang trại nhỏ
                  </p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">500.000đ</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">
                    /tháng
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Tối đa 5 khu vực
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Tối đa 20 thiết bị IoT
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Lưu trữ dữ liệu 3 tháng
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Hỗ trợ email
                  </li>
                </ul>
                <div className="mt-6 h-full flex items-end">
                  <Button className="w-full" variant="outline">
                    Bắt đầu dùng thử
                  </Button>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm relative">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                  Phổ biến nhất
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Chuyên nghiệp</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Dành cho trang trại vừa
                  </p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">1.200.000đ</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">
                    /tháng
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Tối đa 15 khu vực
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Tối đa 50 thiết bị IoT
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Lưu trữ dữ liệu 1 năm
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Hỗ trợ 24/7
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Dự đoán sâu bệnh nâng cao
                  </li>
                </ul>
                <div className="mt-6 h-full flex items-end">
                  <Button className="w-full">Bắt đầu dùng thử</Button>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Doanh nghiệp</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Dành cho trang trại lớn
                  </p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">Liên hệ</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Không giới hạn khu vực
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Không giới hạn thiết bị IoT
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Lưu trữ dữ liệu không giới hạn
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Hỗ trợ 24/7 ưu tiên
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Tích hợp API tùy chỉnh
                  </li>
                </ul>
                <div className="mt-6 h-full flex items-end">
                  <Button className="w-full" variant="outline">
                    Liên hệ với chúng tôi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-800/30 dark:text-green-400">
                  Liên hệ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Bạn có câu hỏi? Chúng tôi sẵn sàng trợ giúp
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-800/30">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Điện thoại</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      +84 123 456 789
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-800/30">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect height="16" rx="2" width="20" x="2" y="4" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      info@agroiot.vn
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-800/30">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Địa chỉ</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      123 Đường Nông Nghiệp, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="name"
                      >
                        Họ tên
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="name"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="email"
                        placeholder="example@example.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="subject"
                    >
                      Tiêu đề
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="subject"
                      placeholder="Tôi muốn tìm hiểu thêm về dịch vụ của bạn"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="message"
                    >
                      Nội dung
                    </label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="message"
                      placeholder="Nhập nội dung tin nhắn của bạn tại đây..."
                    />
                  </div>
                  <Button className="w-full" type="submit">
                    Gửi tin nhắn
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Sẵn sàng tối ưu hóa trang trại của bạn?
                </h2>
                <p className="max-w-[900px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Đăng ký ngay hôm nay để trải nghiệm sức mạnh của nông nghiệp
                  thông minh
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    Bắt đầu dùng thử miễn phí
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-green-600"
                  asChild
                >
                  <Link href="/contact">Liên hệ với chúng tôi</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="text-xl font-bold">AgroIoT</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Giải pháp quản lý nông nghiệp thông minh dựa trên IoT
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Sản phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Tài liệu
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Công ty</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Pháp lý</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    Cookie
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AgroIoT. Tất cả các quyền được bảo
            lưu.
          </div>
        </div>
      </footer>
    </div>
  );
}
