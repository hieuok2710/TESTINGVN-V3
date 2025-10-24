import { NavItem } from './types'; // Assuming types are in a separate file or defined in the component

export { NAV_ITEMS, FEATURED_NEWS, FEATURED_VIDEOS, GALLERY_IMAGES, UPCOMING_EVENTS, PAST_EVENTS, GRADE_LEVELS, ALL_CLASSES, SUBJECT_LEVELS, QUESTION_BANK };
export type { NavItem, QuizQuestion };


interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', href: '#' },
  { 
    label: 'Giới thiệu', 
    href: '#',
  },
  { 
    label: 'Các kỳ thi', 
    href: '#',
  },
  { label: 'Tin tức', href: '#' },
  { label: 'Hỗ trợ', href: '#' },
  { label: 'Vào thi', href: '#' },
];

const FEATURED_NEWS = [
    {
        title: 'Hướng dẫn học sinh tham gia Hội thao giáo dục quốc phòng và an ninh',
        category: 'Tin tức',
        image: 'https://picsum.photos/400/300?random=1',
        date: '27/04/2024'
    },
    {
        title: 'Sôi nổi các hoạt động chào mừng kỷ niệm 49 năm ngày Giải phóng miền Nam',
        category: 'Sự kiện',
        image: 'https://picsum.photos/400/300?random=2',
        date: '26/04/2024'
    },
    {
        title: 'Tuyên truyền, phổ biến pháp luật về phòng, chống ma túy trong học đường',
        category: 'Thông báo',
        image: 'https://picsum.photos/400/300?random=3',
        date: '25/04/2024'
    },
    {
        title: 'Phát động cuộc thi trực tuyến tìm hiểu về Chủ tịch Hồ Chí Minh',
        category: 'Cuộc thi',
        image: 'https://picsum.photos/400/300?random=4',
        date: '24/04/2024'
    },
];

const FEATURED_VIDEOS = [
    {
        id: 'dQw4w9WgXcQ',
        title: 'Khai giảng năm học mới 2023-2024',
        thumbnail: 'https://picsum.photos/1280/720?random=5'
    },
    {
        id: '3JZ_D3ELwOQ',
        title: 'Hoạt động ngoại khóa: Tìm hiểu lịch sử địa phương',
        thumbnail: 'https://picsum.photos/400/225?random=6'
    },
    {
        id: 'L_LUpnjgPso',
        title: 'Hội thi văn nghệ chào mừng ngày Nhà giáo Việt Nam',
        thumbnail: 'https://picsum.photos/400/225?random=7'
    },
    {
        id: 'ru-S_pALM6g',
        title: 'Câu lạc bộ STEM: Chế tạo robot',
        thumbnail: 'https://picsum.photos/400/225?random=8'
    }
];

const GALLERY_IMAGES = [
    'https://picsum.photos/600/400?random=10',
    'https://picsum.photos/600/400?random=11',
    'https://picsum.photos/600/400?random=12',
    'https://picsum.photos/600/400?random=13',
    'https://picsum.photos/600/400?random=14',
    'https://picsum.photos/600/400?random=15',
    'https://picsum.photos/600/400?random=16',
    'https://picsum.photos/600/400?random=17',
    'https://picsum.photos/600/400?random=18',
    'https://picsum.photos/600/400?random=19',
    'https://picsum.photos/600/400?random=20',
    'https://picsum.photos/600/400?random=21',
    'https://picsum.photos/600/400?random=22',
    'https://picsum.photos/600/400?random=23',
    'https://picsum.photos/600/400?random=24',
    'https://picsum.photos/600/400?random=25',
];

const UPCOMING_EVENTS = [
    { date: '30/05', title: 'Lễ tổng kết năm học 2023-2024' },
    { date: '15/06', title: 'Khóa học hè "Công dân toàn cầu"' },
    { date: '01/07', title: 'Chương trình trại hè kỹ năng sống' },
    { date: '10/07', title: 'Cuộc thi "Sáng tạo Khoa học Kỹ thuật"' },
    { date: '25/07', title: 'Hội thảo "Định hướng nghề nghiệp tương lai"' },
    { date: '05/08', title: 'Giải bóng đá học sinh toàn trường' },
    { date: '20/08', title: 'Lễ kỷ niệm ngày thành lập trường' },
];

const PAST_EVENTS = [
    { date: '20/04', title: 'Ngày hội đọc sách và văn hóa đọc' },
    { date: '10/03', title: 'Hội thao chào mừng ngày thành lập Đoàn' },
    { date: '25/02', title: 'Cuộc thi "Giai điệu tuổi hồng" cấp trường' },
];

const GRADE_LEVELS = [
  {
    level: 'CẤP 1',
    classes: ['LỚP 1', 'LỚP 2', 'LỚP 3', 'LỚP 4', 'LỚP 5'],
  },
  {
    level: 'CẤP 2',
    classes: ['LỚP 6', 'LỚP 7', 'LỚP 8', 'LỚP 9'],
  },
  {
    level: 'CẤP 3',
    classes: ['LỚP 10', 'LỚP 11', 'LỚP 12'],
  },
];

const ALL_CLASSES = Array.from({ length: 12 }, (_, i) => `LỚP ${i + 1}`);

const SUBJECT_LEVELS = [
  {
    subject: 'ÔN TẬP MÔN TOÁN',
    classes: ALL_CLASSES,
  },
  {
    subject: 'ÔN TẬP TIẾNG VIỆT',
    classes: ALL_CLASSES,
  },
  {
    subject: 'ÔN TẬP TIẾNG ANH',
    classes: ALL_CLASSES,
  },
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  image?: string;
}

export const QUIZ_ROUNDS = [
  { id: 1, name: 'Vòng 1: Khởi động' },
  { id: 2, name: 'Vòng 2: Vượt chướng ngại vật' },
  { id: 3, name: 'Vòng 3: Tăng tốc' },
  { id: 4, name: 'Vòng 4: Về đích' },
];


const QUESTION_BANK: { [subject: string]: { [className: string]: QuizQuestion[] } } = {
    'ÔN TẬP MÔN TOÁN': {
        'LỚP 1': [
            // Image questions
            { question: "Trong hình có mấy quả táo?", image: "https://placehold.co/600x300/ef4444/ffffff?text=5+quả+táo", options: ["3", "4", "5", "6"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Đây là hình gì?", image: "https://placehold.co/400x400/3b82f6/ffffff?text=Hình+tròn", options: ["Hình vuông", "Hình tam giác", "Hình chữ nhật", "Hình tròn"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "Bông hoa nào có 5 cánh?", image: "https://placehold.co/600x300/eab308/ffffff?text=Hoa+4+cánh+%26+Hoa+5+cánh", options: ["Bông hoa bên trái", "Bông hoa bên phải", "Cả hai", "Không có"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Có 3 con vịt đang bơi, thêm 2 con nữa bơi đến. Hỏi có tất cả bao nhiêu con vịt trong hình?", image: "https://placehold.co/600x300/22c55e/ffffff?text=3+vịt+%2B+2+vịt", options: ["3 con", "2 con", "5 con", "4 con"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Trên cây có 7 quả, rụng mất 2 quả. Hỏi trên cây còn lại mấy quả?", image: "https://placehold.co/600x300/8b5cf6/ffffff?text=Cây+có+7+quả", options: ["9 quả", "5 quả", "6 quả", "7 quả"], correctAnswerIndex: 1, difficulty: 'hard' },
            // Easy
            { question: "Số liền sau của số 8 là số nào?", options: ["7", "8", "9", "10"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "2 + 7 = ?", options: ["8", "9", "10", "6"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "10 - 4 = ?", options: ["5", "7", "6", "8"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Trong các số 3, 9, 1, 5, số lớn nhất là số nào?", options: ["3", "1", "5", "9"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "5 + 0 = ?", options: ["0", "50", "5", "4"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Trong số 17, chữ số hàng chục là gì?", options: ["1", "7", "10", "17"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Điền số còn thiếu: 1, 2, 3, __, 5", options: ["6", "0", "4", "7"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "8 - 3 = ?", options: ["5", "6", "11", "4"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Điền dấu thích hợp vào chỗ trống: 7 __ 5", options: ["<", ">", "=", "+"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "4 + 4 = ?", options: ["0", "1", "4", "8"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "9 - 9 = ?", options: ["0", "1", "9", "18"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Số bé nhất có một chữ số là số nào?", options: ["1", "9", "0", "10"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Có 3 quả táo, thêm 2 quả nữa. Hỏi có tất cả mấy quả táo?", options: ["1 quả", "5 quả", "6 quả", "4 quả"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Số gồm 1 chục và 2 đơn vị là số nào?", options: ["3", "12", "21", "102"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "6 + 3 = ?", options: ["3", "8", "10", "9"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "Số liền trước của số 10 là số nào?", options: ["11", "9", "8", "1"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "7 - 5 = ?", options: ["12", "3", "2", "4"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Có 4 bông hoa màu đỏ và 5 bông hoa màu vàng. Hỏi có tất cả bao nhiêu bông hoa?", options: ["1 bông", "8 bông", "9 bông", "10 bông"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "So sánh 8 và 8. Chọn dấu thích hợp.", options: [">", "<", "=", "Không so sánh được"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Phép tính nào có kết quả bằng 10?", options: ["5 + 4", "10 - 1", "7 + 3", "2 + 9"], correctAnswerIndex: 2, difficulty: 'easy' },
            // Medium
            { question: "12 + 5 = ?", options: ["16", "7", "17", "18"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "18 - 6 = ?", options: ["11", "12", "13", "24"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Lan có 5 cái kẹo, mẹ cho thêm 7 cái. Hỏi Lan có tất cả bao nhiêu cái kẹo?", options: ["2 cái", "11 cái", "12 cái", "13 cái"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Điền số thích hợp: __ + 5 = 15", options: ["5", "10", "15", "20"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Trong một tuần lễ, em đi học mấy ngày (từ thứ Hai đến thứ Sáu)?", options: ["7 ngày", "6 ngày", "5 ngày", "4 ngày"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "19 - __ = 11", options: ["7", "8", "9", "10"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Hình vuông có mấy cạnh bằng nhau?", options: ["2 cạnh", "3 cạnh", "4 cạnh", "Không có cạnh nào"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Số lớn nhất có hai chữ số mà chữ số hàng chục là 1 là số nào?", options: ["10", "11", "18", "19"], correctAnswerIndex: 3, difficulty: 'medium' },
            { question: "An có 15 viên bi, An cho Bình 4 viên. Hỏi An còn lại mấy viên bi?", options: ["19 viên", "11 viên", "10 viên", "12 viên"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "9 + 8 = ?", options: ["16", "1", "18", "17"], correctAnswerIndex: 3, difficulty: 'medium' },
            { question: "16 - 9 = ?", options: ["6", "7", "8", "25"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Sắp xếp các số 11, 2, 17, 9 theo thứ tự từ lớn đến bé.", options: ["2, 9, 11, 17", "17, 11, 9, 2", "17, 9, 11, 2", "2, 11, 9, 17"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "1 chục + 5 đơn vị = ?", options: ["6", "51", "15", "105"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Tìm x, biết: x - 7 = 10", options: ["3", "17", "10", "7"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Một con gà có 2 chân. Hỏi 4 con gà có bao nhiêu chân?", options: ["6 chân", "4 chân", "8 chân", "10 chân"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Số 15 gồm mấy chục và mấy đơn vị?", options: ["1 chục và 5 đơn vị", "5 chục và 1 đơn vị", "10 chục và 5 đơn vị", "15 chục và 0 đơn vị"], correctAnswerIndex: 0, difficulty: 'medium' },
            { question: "7 + 6 = ?", options: ["1", "12", "13", "14"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Có 12 quả cam, đã ăn hết 5 quả. Hỏi còn lại mấy quả cam?", options: ["17 quả", "7 quả", "8 quả", "6 quả"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Số bé nhất có hai chữ số khác nhau là số nào?", options: ["11", "01", "10", "12"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Độ dài một gang tay của em khoảng bao nhiêu cm?", options: ["1 cm", "100 cm", "50 cm", "15 cm"], correctAnswerIndex: 3, difficulty: 'medium' },
            // Hard
            { question: "Trên cành cây có 10 con chim, bay đi 3 con, rồi lại có 5 con khác bay đến. Hỏi trên cành có bao nhiêu con chim?", options: ["8 con", "12 con", "15 con", "18 con"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Điền số tiếp theo vào dãy số: 10, 12, 14, __, 18", options: ["15", "17", "16", "20"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Mẹ mua về 15 quả trứng, mẹ dùng 4 quả để rán và 5 quả để luộc. Hỏi mẹ còn lại bao nhiêu quả trứng?", options: ["9 quả", "11 quả", "6 quả", "5 quả"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Từ các chữ số 1, 5, 6, có thể lập được bao nhiêu số có hai chữ số khác nhau?", options: ["3 số", "4 số", "9 số", "6 số"], correctAnswerIndex: 3, difficulty: 'hard' },
            { question: "Hôm nay là thứ Ba. Hỏi 4 ngày nữa là thứ mấy?", options: ["Thứ Sáu", "Thứ Bảy", "Chủ Nhật", "Thứ Năm"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "An hơn Bình 3 tuổi. Năm nay An 10 tuổi. Hỏi Bình mấy tuổi?", options: ["13 tuổi", "8 tuổi", "7 tuổi", "6 tuổi"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Tìm một số, biết rằng lấy số đó cộng với 5 rồi trừ đi 2 thì được 13.", options: ["10", "11", "8", "16"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Số lớn nhất có hai chữ số mà tổng hai chữ số bằng 9 là số nào?", options: ["18", "81", "90", "99"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "5 + __ > 11. Số nhỏ nhất có thể điền vào chỗ trống là?", options: ["5", "6", "7", "8"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Anh có 18 cái kẹo, em có ít hơn anh 7 cái. Hỏi cả hai anh em có bao nhiêu cái kẹo?", options: ["11 cái", "25 cái", "29 cái", "32 cái"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "19 - 8 + 5 = ?", options: ["6", "11", "16", "22"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Tìm hai số có tổng bằng 12 và hiệu bằng 2.", options: ["6 và 6", "8 và 4", "7 và 5", "10 và 2"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Ba năm nữa, tuổi của Hoa là 10. Hỏi năm ngoái Hoa mấy tuổi?", options: ["7 tuổi", "6 tuổi", "5 tuổi", "13 tuổi"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Có bao nhiêu số có hai chữ số mà chữ số hàng đơn vị là 9?", options: ["8 số", "9 số", "10 số", "1 số"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Một sợi dây dài 15cm, cắt đi một đoạn. Đoạn còn lại dài 8cm. Hỏi đoạn cắt đi dài bao nhiêu cm?", options: ["23cm", "7cm", "8cm", "10cm"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "4 + 7 + 6 = ?", options: ["11", "13", "17", "18"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Lớp 1A có 20 bạn, trong đó có 12 bạn nữ. Hỏi số bạn nam ít hơn số bạn nữ bao nhiêu bạn?", options: ["8 bạn", "4 bạn", "2 bạn", "10 bạn"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Tìm số có hai chữ số, biết chữ số hàng chục là số liền sau của 4, chữ số hàng đơn vị là số liền trước của 2.", options: ["41", "51", "52", "42"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Trong chuồng có cả gà và thỏ. Đếm được tất cả 5 cái đầu và 14 cái chân. Hỏi có mấy con gà, mấy con thỏ?", options: ["2 gà, 3 thỏ", "4 gà, 1 thỏ", "3 gà, 2 thỏ", "1 gà, 4 thỏ"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Trong hộp có 5 bi xanh và 4 bi đỏ. Không nhìn vào hộp, phải lấy ra ít nhất bao nhiêu viên bi để chắc chắn có được 1 viên bi đỏ?", options: ["1 viên", "5 viên", "6 viên", "9 viên"], correctAnswerIndex: 2, difficulty: 'hard' },
        ],
        'LỚP 2': [
            { question: "Câu 1: 15 + 25 = ?", options: ["30", "35", "40", "45"], correctAnswerIndex: 2 },
        ],
        'LỚP 3': [
            { question: "Câu 1: Một tuần có mấy ngày?", options: ["5", "6", "7", "8"], correctAnswerIndex: 2 },
        ],
        'LỚP 4': [
            { question: "Câu 1: Hình vuông có cạnh 5cm thì chu vi là bao nhiêu?", options: ["10cm", "15cm", "20cm", "25cm"], correctAnswerIndex: 2 },
        ],
        'LỚP 5': [
            { question: "Câu 1: 1/2 + 1/4 = ?", options: ["2/6", "1/8", "3/4", "2/4"], correctAnswerIndex: 2 },
        ],
        'LỚP 6': [], 'LỚP 7': [], 'LỚP 8': [], 'LỚP 9': [], 'LỚP 10': [], 'LỚP 11': [], 'LỚP 12': [],
    },
    'ÔN TẬP TIẾNG VIỆT': {
        'LỚP 1': [
            // Image questions
            { question: "Đây là con vật gì?", image: "https://placehold.co/400x400/f97316/ffffff?text=Con+Mèo", options: ["Con chó", "Con gà", "Con lợn", "Con mèo"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "Đồ vật trong hình là cái gì?", image: "https://placehold.co/400x400/14b8a6/ffffff?text=Cái+cặp", options: ["Cái bàn", "Cái cặp", "Cái ghế", "Quyển sách"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Tìm từ tương ứng với hình ảnh.", image: "https://placehold.co/400x400/64748b/ffffff?text=Ngôi+nhà", options: ["ngôi nhà", "ngôi sao", "dòng sông", "bông hoa"], correctAnswerIndex: 0, difficulty: 'medium' },
            { question: "Trong hình, em bé đang làm gì?", image: "https://placehold.co/600x300/ec4899/ffffff?text=Bé+đang+đọc+sách", options: ["Đang ngủ", "Đang ăn", "Đang đọc sách", "Đang chơi"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Câu nào miêu tả đúng hình ảnh?", image: "https://placehold.co/600x300/0ea5e9/ffffff?text=Mặt+trời+tỏa+nắng", options: ["Trời đang mưa.", "Mặt trời đang tỏa nắng.", "Trời đầy mây.", "Trời tối."], correctAnswerIndex: 1, difficulty: 'hard' },
            // Easy
            { question: "Điền 'ch' hay 'tr' vào chỗ trống: quả __anh", options: ["ch", "tr"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Chọn từ viết đúng: ", options: ["cái bàn", "cái bàng"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Vần 'ay' có trong từ nào sau đây?", options: ["máy bay", "mây bay"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Điền 'g' hay 'gh' vào chỗ trống: __ế gỗ", options: ["g", "gh"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Con vật nào kêu 'meo meo'?", options: ["Con chó", "Con mèo", "Con lợn", "Con gà"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Điền vần 'ươn' hay 'ương' vào chỗ trống: con đ__`g", options: ["ươn", "ương"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Trong từ 'sách vở', tiếng nào có thanh sắc?", options: ["sách", "vở", "cả hai", "không có"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Điền chữ còn thiếu vào chỗ trống: b__ông hoa", options: ["â", "o", "ô", "a"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Cái gì dùng để viết?", options: ["Cục tẩy", "Cái bút", "Quyển vở", "Cái thước"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Tìm từ có tiếng chứa vần 'an'.", options: ["cái bảng", "quả banh", "cái làn", "cả ba từ trên"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Điền 'd', 'gi' hay 'r' vào chỗ trống: __a đình", options: ["d", "gi", "r"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Từ 'bố mẹ' có mấy tiếng?", options: ["1 tiếng", "2 tiếng", "3 tiếng", "4 tiếng"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Chữ cái đầu tiên trong bảng chữ cái tiếng Việt là gì?", options: ["ă", "â", "a", "b"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Tìm từ viết sai chính tả:", options: ["ngôi sao", "ngoi sao", "ngôi nhà", "dòng sông"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Điền dấu hỏi hoặc dấu ngã vào chữ 'mu': cái m__", options: ["dấu hỏi", "dấu ngã"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Hoa gì thường có màu đỏ và có gai?", options: ["Hoa cúc", "Hoa mai", "Hoa hồng", "Hoa lan"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Âm 'nh' có trong từ nào sau đây?", options: ["cái nhà", "con nga", "quả na", "bông hoa"], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "Từ 'học sinh' chỉ ai?", options: ["Chỉ đồ vật", "Chỉ con vật", "Chỉ người", "Chỉ cây cối"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Điền 'c' hay 'k' vào chỗ trống: __im én", options: ["c", "k"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Trong từ 'cây tre', tiếng nào đứng trước?", options: ["tre", "cây", "bằng nhau", "không có"], correctAnswerIndex: 1, difficulty: 'easy' },
            // Medium
            { question: "Sắp xếp các từ sau để tạo thành câu: đá, bé, bóng.", options: ["Bé bóng đá.", "Đá bé bóng.", "Bé đá bóng.", "Bóng đá bé."], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Câu 'Mẹ em là cô giáo.' kết thúc bằng dấu câu gì?", options: ["Dấu hỏi", "Dấu chấm", "Dấu chấm than", "Dấu phẩy"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Từ nào chỉ hoạt động trong các từ sau: quyển sách, đi học, cái cây.", options: ["quyển sách", "đi học", "cái cây", "tất cả"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Tìm từ trái nghĩa với 'trắng'.", options: ["xanh", "vàng", "đen", "đỏ"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Trong câu 'Con mèo đang trèo cây cau.', con vật nào được nhắc đến?", options: ["con chó", "con gà", "con mèo", "con cau"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Điền từ còn thiếu vào câu: 'Ngoài vườn, hoa hồng ... đỏ thắm.'", options: ["héo", "nở", "bay", "chạy"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "'Ai là người trồng cây?' - Đây là loại câu gì?", options: ["Câu kể", "Câu cảm", "Câu hỏi", "Câu cầu khiến"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Tìm từ chỉ đồ vật:", options: ["quả cam", "cái cặp", "con chó", "cây bàng"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Từ 'long lanh' là từ loại gì?", options: ["Từ đơn", "Từ ghép", "Từ láy", "Danh từ"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Câu nào sau đây là câu kể?", options: ["Bạn tên là gì?", "Bông hoa này đẹp quá!", "Em đang học bài.", "Hãy trật tự!"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Từ nào không cùng nhóm với các từ còn lại: bàn, ghế, tủ, quả táo.", options: ["bàn", "ghế", "tủ", "quả táo"], correctAnswerIndex: 3, difficulty: 'medium' },
            { question: "Bộ phận chính của cây gồm những gì?", options: ["rễ, thân, lá", "hoa, quả", "cành, ngọn", "tất cả đều đúng"], correctAnswerIndex: 0, difficulty: 'medium' },
            { question: "Viết lại câu sau cho đúng chính tả: 'em thích đi học'", options: ["em thích đi Học", "Em thích đi học.", "em thích đi học.", "Em thích đi Học."], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Từ nào viết đúng chính tả?", options: ["rũng cảm", "dũng cảm", "dũng cãm", "rũng cãm"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Kể tên một loại quả có vị chua.", options: ["Quả chuối", "Quả dưa hấu", "Quả chanh", "Quả na"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Câu 'Hôm nay, trời nắng đẹp.' nói về điều gì?", options: ["Con người", "Sự vật", "Thời tiết", "Cảm xúc"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Tìm câu có hình ảnh so sánh.", options: ["Em đi học.", "Mặt trời đỏ như quả cầu lửa.", "Con mèo đang ngủ.", "Trời mưa to."], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "'Chú bộ đội' - cụm từ này chỉ ai?", options: ["Chỉ đồ vật", "Chỉ người", "Chỉ con vật", "Chỉ thời gian"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Tìm 2 từ chỉ màu sắc.", options: ["nhanh, chậm", "cao, thấp", "xanh, đỏ", "vui, buồn"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Trong câu 'Bé giúp mẹ quét nhà.', từ chỉ hoạt động là từ nào?", options: ["Bé", "mẹ", "nhà", "giúp, quét"], correctAnswerIndex: 3, difficulty: 'medium' },
            // Hard
            { question: "Đọc đoạn văn: 'Nhà Lan có một vườn cây nhỏ. Trong vườn trồng rất nhiều hoa cúc màu vàng tươi. Lan rất thích ra vườn ngắm hoa.' Hỏi: Vườn nhà Lan trồng hoa gì?", options: ["Hoa hồng", "Hoa mai", "Hoa cúc", "Hoa lan"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Tìm lỗi sai và sửa lại câu: 'Con châu đang gặm cỏ.'", options: ["châu -> trâu", "gặm -> gậm", "cỏ -> cõ", "Câu đúng"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Giải câu đố: 'Con gì đuôi ngắn tai dài / Mắt hồng lông mượt có tài chạy nhanh?'", options: ["Con mèo", "Con thỏ", "Con chó", "Con hươu"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Từ 'chăm chỉ' đồng nghĩa với từ nào?", options: ["lười biếng", "siêng năng", "thông minh", "nhanh nhẹn"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Xác định danh từ, động từ trong câu: 'Bé đọc sách.'", options: ["Bé(DT), đọc(ĐT), sách(DT)", "Bé(ĐT), đọc(DT), sách(ĐT)", "Bé(DT), đọc(DT), sách(ĐT)", "Tất cả là danh từ"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Điền 's' hay 'x' cho đúng: __inh đẹp, __ản xuất", options: ["s, x", "x, s", "s, s", "x, x"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Đặt câu hỏi cho bộ phận được gạch chân trong câu: 'Lan học bài <u>rất chăm chỉ</u>.'", options: ["Lan học bài làm gì?", "Lan học bài ở đâu?", "Lan học bài khi nào?", "Lan học bài như thế nào?"], correctAnswerIndex: 3, difficulty: 'hard' },
            { question: "Viết một câu có sử dụng dấu phẩy.", options: ["Em yêu trường em.", "Mẹ em mua cam, quýt và táo.", "Hôm nay trời đẹp quá!", "Bạn có khỏe không?"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Từ 'hiền lành' trái nghĩa với từ nào?", options: ["dữ tợn", "tốt bụng", "chăm chỉ", "thật thà"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Trong câu 'Mắt của bé tròn xoe.', từ nào là từ chỉ đặc điểm?", options: ["Mắt", "bé", "của", "tròn xoe"], correctAnswerIndex: 3, difficulty: 'hard' },
            { question: "Gạch chân dưới từ chỉ người trong câu: 'Bác nông dân đang cày ruộng.'", options: ["ruộng", "cày", "Bác nông dân", "đang"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Viết một câu cảm thán.", options: ["Em đang học bài.", "Ôi, bông hoa đẹp quá!", "Ngày mai bạn đi đâu?", "Mẹ em là bác sĩ."], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Dựa vào từ 'đi', hãy tạo ra 2 từ ghép.", options: ["đi đứng, đi chơi", "đi lại, đứng lại", "chơi đùa, đi bộ", "tất cả đều sai"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Trong các từ sau, từ nào là từ láy: 'sạch sẽ', 'sạch bong', 'sạch đẹp'", options: ["sạch sẽ", "sạch bong", "sạch đẹp", "không có"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Hoàn thành câu thành ngữ: 'Học thầy không tày...'", options: ["học thêm", "học nữa", "học bạn", "học mãi"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Điền cặp vần thích hợp 'iu-êu' vào chỗ trống: 'Buổi ch..., gió thổi h... h...'.", options: ["iều, iu", "êu, iu", "iu, iều", "êu, iều"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Tìm từ có tiếng bắt đầu bằng 'ng' và một từ có tiếng bắt đầu bằng 'ngh'.", options: ["ngủ, nghe", "ngã, nghiêng", "ngon, ghế", "tất cả đều đúng"], correctAnswerIndex: 3, difficulty: 'hard' },
            { question: "Câu nào dưới đây sử dụng sai từ 'sôi sụt'?", options: ["Nước mắt chảy sụt sùi.", "Bụng đói sôi sùng sục.", "Nồi canh sôi sùng sục.", "Em bé khóc sụt sùi."], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Kể tên 3 đồ dùng học tập của em.", options: ["bàn, ghế, tủ", "bát, đũa, thìa", "bút, thước, tẩy", "quần, áo, mũ"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Trong các cặp từ sau, cặp từ nào trái nghĩa với nhau?", options: ["hiền lành - tốt bụng", "nhanh nhẹn - chậm chạp", "vui vẻ - sung sướng", "chăm chỉ - siêng năng"], correctAnswerIndex: 1, difficulty: 'hard' },
        ],
        'LỚP 2': [
            { question: "Câu 1: Từ nào chỉ hoạt động?", options: ["cái bàn", "quyển vở", "chạy", "bông hoa"], correctAnswerIndex: 2 },
        ],
        'LỚP 3': [
            { question: "Câu 1: Dấu câu nào dùng để kết thúc một câu kể?", options: ["Dấu chấm", "Dấu phẩy", "Dấu hỏi", "Dấu chấm than"], correctAnswerIndex: 0 },
        ],
        'LỚP 4': [
            { question: "Câu 1: Ai là người lãnh đạo cuộc khởi nghĩa Hai Bà Trưng?", options: ["Trưng Trắc và Trưng Nhị", "Bà Triệu", "Lý Bí", "Ngô Quyền"], correctAnswerIndex: 0 },
        ],
        'LỚP 5': [
            { question: "Câu 1: Tỉnh nào của Việt Nam có diện tích lớn nhất?", options: ["Thanh Hóa", "Sơn La", "Nghệ An", "Quảng Nam"], correctAnswerIndex: 2 },
            { question: "Câu 2: Câu 'Trời mưa.' thuộc loại câu gì?", options: ["Câu cầu khiến", "Câu cảm thán", "Câu nghi vấn", "Câu kể"], correctAnswerIndex: 3 },
            { question: "Câu 3: Nước bốc hơi thành gì?", options: ["Nước đá", "Hơi nước", "Sương", "Mây"], correctAnswerIndex: 1 },
            { question: "Câu 4: Chiến thắng Điện Biên Phủ diễn ra vào năm nào?", options: ["1945", "1954", "1968", "1975"], correctAnswerIndex: 1 },
        ],
        'LỚP 6': [], 'LỚP 7': [], 'LỚP 8': [], 'LỚP 9': [], 'LỚP 10': [], 'LỚP 11': [], 'LỚP 12': [],
    },
    'ÔN TẬP TIẾNG ANH': {
        'LỚP 1': [
            // Easy
            { question: "What color is an apple?", options: ["Blue", "Yellow", "Red", "Green"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "How many pencils are there? (Image of 3 pencils)", options: ["One", "Two", "Three", "Four"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "What is this? (Image of a cat)", options: ["A dog", "A cat", "A bird", "A fish"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "Choose the correct greeting:", options: ["Goodbye", "Hello", "Hlelo", "Thank you"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "What number is this: '5'?", options: ["Four", "Five", "Six", "Seven"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "A dog says...", options: ["Meow", "Woof", "Moo", "Oink"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "How to answer 'What is your name?'", options: ["I'm fine", "I'm 6", "My name is Lan", "Goodbye"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "What is this? (Image of a book)", options: ["A pen", "A ruler", "A book", "A bag"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "Find the odd one out:", options: ["apple", "banana", "car", "orange"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "What color is the sky?", options: ["Red", "Green", "Yellow", "Blue"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "How are you?", options: ["I'm fine, thank you.", "My name is Quan.", "Hello.", "It's a cat."], correctAnswerIndex: 0, difficulty: 'easy' },
            { question: "One, two, ..., four.", options: ["five", "three", "six", "zero"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "A fish can...", options: ["fly", "run", "swim", "sing"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "The opposite of 'big' is...", options: ["tall", "small", "long", "short"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "What is this? (Image of a ball)", options: ["A doll", "A car", "A robot", "A ball"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "What letter is this: 'B'?", options: ["A", "D", "C", "B"], correctAnswerIndex: 3, difficulty: 'easy' },
            { question: "This is an...", options: ["apple", "ant", "arm", "alligator"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "How do you spell the number '1'?", options: ["t-w-o", "o-n-e", "t-e-n", "n-o-e"], correctAnswerIndex: 1, difficulty: 'easy' },
            { question: "When you leave, you say...", options: ["Hello", "Good morning", "Goodbye", "Thank you"], correctAnswerIndex: 2, difficulty: 'easy' },
            { question: "What is this? (Image of the sun)", options: ["The moon", "A star", "The sun", "A cloud"], correctAnswerIndex: 2, difficulty: 'easy' },
            // Medium
            { question: "It is a ... (Image of a yellow pencil)", options: ["yellow pencil", "pencil yellow", "a yellow", "a pencil"], correctAnswerIndex: 0, difficulty: 'medium' },
            { question: "I have two ... (Image of eyes)", options: ["noses", "ears", "eyes", "hands"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Fill in the blank: 'This __ a pen.'", options: ["am", "is", "are", "be"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "What can you do? (Image of someone running)", options: ["I can read.", "I can jump.", "I can run.", "I can swim."], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "The book is __ the table. (Image of a book ON a table)", options: ["in", "on", "under", "at"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "Is it a bird? (Image of a plane)", options: ["Yes, it is.", "No, it is.", "Yes, it isn't.", "No, it isn't."], correctAnswerIndex: 3, difficulty: 'medium' },
            { question: "What's the weather like? (Image of a sunny day)", options: ["It's rainy.", "It's windy.", "It's cloudy.", "It's sunny."], correctAnswerIndex: 3, difficulty: 'medium' },
            { question: "This is my... (Image pointing to a head)", options: ["arm", "leg", "head", "foot"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Can you fly?", options: ["Yes, I can.", "No, I can't.", "Yes, I do.", "No, I don't."], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "How old are you?", options: ["I'm fine.", "I'm six years old.", "My name is Peter.", "I like dogs."], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "What shape is this? (Image of a square)", options: ["A circle", "A triangle", "A square", "A star"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "The cat is sleeping __ the box. (Image of a cat IN a box)", options: ["on", "at", "in", "under"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Unscramble the word: 'atc'", options: ["tac", "act", "cat", "tca"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "Do you have a pet?", options: ["Yes, I do.", "Yes, I am.", "No, I can't.", "Yes, it is."], correctAnswerIndex: 0, difficulty: 'medium' },
            { question: "I go to school by... (Image of a bus)", options: ["car", "train", "bus", "bike"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "What is he doing? (Image of a boy reading)", options: ["He is sleeping.", "He is eating.", "He is reading.", "He is playing."], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "A monkey likes to eat...", options: ["carrots", "bananas", "fish", "cake"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "What animal is big and grey?", options: ["A mouse", "An elephant", "A tiger", "A bird"], correctAnswerIndex: 1, difficulty: 'medium' },
            { question: "This is my... (Image of a family)", options: ["school", "house", "family", "friend"], correctAnswerIndex: 2, difficulty: 'medium' },
            { question: "What do you do in the morning?", options: ["Go to bed", "Eat dinner", "Wake up", "Watch TV"], correctAnswerIndex: 2, difficulty: 'medium' },
            // Hard
            { question: "Read and answer: 'My name is Tom. I have a red car and a blue ball.' - What color is Tom's car?", options: ["Blue", "Red", "Green", "Yellow"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Make a sentence:", options: ["is / This / my / school.", "This is my school.", "My school is this.", "School my is this."], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Where is the apple? (Image of an apple UNDER a tree)", options: ["It is on the tree.", "It is in the tree.", "It is under the tree.", "It is the tree."], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "There are five birds. Two birds fly away. How many birds are left?", options: ["Five", "Two", "Seven", "Three"], correctAnswerIndex: 3, difficulty: 'hard' },
            { question: "What time is it? (Image of a clock at 9:00)", options: ["It's 9 o'clock.", "It's 12 o'clock.", "It's 3 o'clock.", "It's 6 o'clock."], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "Describe the picture: (Image of a girl eating an apple)", options: ["The girl is sleeping.", "The girl is eating an apple.", "The boy is eating a banana.", "The girl has a book."], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Who is this? (Image of a doctor)", options: ["A teacher", "A police officer", "A doctor", "A farmer"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Which one is different?", options: ["Lion", "Tiger", "Monkey", "Fish"], correctAnswerIndex: 3, difficulty: 'hard' },
            { question: "Fill in the blanks: 'I can __ with my eyes, and I can __ with my ears.'", options: ["see, hear", "hear, see", "smell, touch", "run, jump"], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "What is the plural of 'book'?", options: ["bookes", "books", "book's", "booking"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Ask a question for the answer: 'I live in Hanoi.'", options: ["What is your name?", "How old are you?", "Where do you live?", "Do you like Hanoi?"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "Correct the sentence: 'He have a dog.'", options: ["He has a dog.", "He is a dog.", "He are a dog.", "He haves a dog."], correctAnswerIndex: 0, difficulty: 'hard' },
            { question: "What are they? (Image of grapes)", options: ["They are apples.", "They are bananas.", "They are grapes.", "It is a grape."], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "I wear this on my feet. What is it?", options: ["A hat", "A T-shirt", "Shoes", "Gloves"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "The opposite of 'hot' is...", options: ["warm", "cold", "sunny", "cool"], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "Can a fish climb a tree?", options: ["Yes, it can.", "No, it can't.", "Maybe.", "I don't know."], correctAnswerIndex: 1, difficulty: 'hard' },
            { question: "What is the boy wearing? (Image of a boy with a T-shirt and shorts)", options: ["A dress", "A jacket and pants", "A T-shirt and shorts", "A sweater"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "What animal says 'oink'?", options: ["A sheep", "A cow", "A pig", "A duck"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "My mother's son is my...", options: ["sister", "father", "brother", "aunt"], correctAnswerIndex: 2, difficulty: 'hard' },
            { question: "What do you use to write?", options: ["An eraser", "A book", "A pen", "A chair"], correctAnswerIndex: 2, difficulty: 'hard' },
        ],
        'LỚP 2': [], 'LỚP 3': [], 'LỚP 5': [], 'LỚP 6': [], 'LỚP 7': [], 'LỚP 8': [], 'LỚP 9': [], 'LỚP 10': [], 'LỚP 11': [], 'LỚP 12': [],
    }
};