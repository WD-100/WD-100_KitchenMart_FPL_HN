import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

// ==== SCHEMA ====

const categorySchema = new mongoose.Schema({
    name: String,
    is_deleted: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

const productSchema = new mongoose.Schema({
    title: String,
    slug: String,
    code: String,
    description: String,
    shot_description: String,
    quantity: Number,
    price: Number,
    sale_price: Number,
    image: String,
    photo_library: [String],
    is_hot: Boolean,
    is_active: Boolean,
    is_deleted: Boolean,
    categories_id: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// ==== MAIN FUNCTION ====

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');

        // 1. Insert Categories
        const categoriesData = [
            "Thiết bị nhà bếp",
            "Điện gia dụng",
            "Dụng cụ nấu ăn",
            "Chăm sóc cá nhân",
            "Làm sạch & vệ sinh",
            "Thiết bị giặt ủi",
            "Đồ dùng phòng khách",
            "Đồ dùng nhà tắm",
            "Thiết bị thông minh",
            "Đồ dùng tiện ích khác",
        ].map(name => ({
            name,
            is_deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        await Category.deleteMany({});
        const insertedCategories = await Category.insertMany(categoriesData);
        console.log('✅ Inserted categories');

        // 2. Insert Products
        const productsData = [
            {
                title: "Lò vi sóng điện tử Sharp R-G272VN-S 20L",
                slug: "lo-vi-song-dien-tu-sharp-r-g272vn-s-20l",
                code: "SP1001",
                description: "Lò vi sóng Sharp R-G272VN-S có dung tích 20L, công suất 800W, nhiều chế độ nấu.",
                shot_description: "Lò vi sóng Sharp dung tích 20L",
                quantity: 10,
                price: 1890000,
                sale_price: 1690000,
                image: "https://cdn.hoanghamobile.vn/i/previewV2/Uploads/2024/09/13/rg572vns.png",
                photo_library: [],
                is_hot: true,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Bếp điện từ đôi Sunhouse SHB9100",
                slug: "bep-dien-tu-doi-sunhouse-shb9100",
                code: "SP1002",
                description: "Bếp điện từ đôi Sunhouse SHB9100 mặt kính chịu lực, 2 vùng nấu tiện lợi.",
                shot_description: "Bếp điện Sunhouse 2 vùng nấu",
                quantity: 15,
                price: 3290000,
                sale_price: 2990000,
                image: "https://picsum.photos/seed/1002/400/400",
                photo_library: [],
                is_hot: false,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Máy hút mùi kính cong Electrolux EFC926BAR",
                slug: "may-hut-mui-kinh-cong-electrolux-efc926bar",
                code: "SP1003",
                description: "Máy hút mùi Electrolux kiểu dáng hiện đại, công suất mạnh mẽ, điều khiển cảm ứng.",
                shot_description: "Máy hút mùi kính cong Electrolux",
                quantity: 5,
                price: 4590000,
                sale_price: 4190000,
                image: "https://picsum.photos/seed/1003/400/400",
                photo_library: [],
                is_hot: false,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Nồi chiên không dầu Lock&Lock EJF351BLK 5.2L",
                slug: "noi-chien-khong-dau-locklock-ejf351blk-52l",
                code: "SP1004",
                description: "Nồi chiên không dầu Lock&Lock dung tích lớn 5.2L, công suất mạnh 1800W.",
                shot_description: "Nồi chiên không dầu Lock&Lock 5.2L",
                quantity: 12,
                price: 2990000,
                sale_price: 2590000,
                image: "https://picsum.photos/seed/1004/400/400",
                photo_library: [],
                is_hot: true,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Máy ép trái cây Panasonic MJ-DJ01SRA",
                slug: "may-ep-trai-cay-panasonic-mj-dj01sra",
                code: "SP1005",
                description: "Máy ép trái cây công suất 800W, vòi chống nhỏ giọt, lưới lọc bằng thép không gỉ.",
                shot_description: "Máy ép trái cây Panasonic 800W",
                quantity: 8,
                price: 2590000,
                sale_price: 2390000,
                image: "https://picsum.photos/seed/1005/400/400",
                photo_library: [],
                is_hot: false,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Máy xay sinh tố đa năng Philips HR2221",
                slug: "may-xay-sinh-to-da-nang-philips-hr2221",
                code: "SP1006",
                description: "Máy xay sinh tố 700W, lưỡi dao 4 cánh, 5 tốc độ, kèm cối xay thịt và hạt.",
                shot_description: "Máy xay sinh tố Philips HR2221",
                quantity: 20,
                price: 1890000,
                sale_price: 1690000,
                image: "https://picsum.photos/seed/1006/400/400",
                photo_library: [],
                is_hot: false,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Ấm đun siêu tốc Kangaroo KG338N 1.8L",
                slug: "am-dun-sieu-toc-kangaroo-kg338n-1-8l",
                code: "SP1007",
                description: "Ấm siêu tốc Kangaroo 1.8L, ruột inox 304, đế xoay 360°, tự ngắt khi sôi.",
                shot_description: "Ấm siêu tốc Kangaroo 1.8L",
                quantity: 30,
                price: 490000,
                sale_price: 420000,
                image: "https://picsum.photos/seed/1007/400/400",
                photo_library: [],
                is_hot: true,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Máy pha cà phê Espresso Tiross TS621",
                slug: "may-pha-ca-phe-espresso-tiross-ts621",
                code: "SP1008",
                description: "Máy pha cà phê Tiross TS621, pha Espresso & Cappuccino, dung tích 1.25L.",
                shot_description: "Máy pha cà phê Espresso Tiross",
                quantity: 6,
                price: 2290000,
                sale_price: 2090000,
                image: "https://picsum.photos/seed/1008/400/400",
                photo_library: [],
                is_hot: false,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Máy nướng bánh mì Tiross TS513",
                slug: "may-nuong-banh-mi-tiross-ts513",
                code: "SP1009",
                description: "Máy nướng bánh mì Tiross TS513, nướng 2 lát, có khay vụn dễ vệ sinh.",
                shot_description: "Máy nướng bánh mì Tiross TS513",
                quantity: 9,
                price: 890000,
                sale_price: 790000,
                image: "https://picsum.photos/seed/1009/400/400",
                photo_library: [],
                is_hot: false,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Nồi cơm điện tử Toshiba RC-18DH1PV 1.8L",
                slug: "noi-com-dien-tu-toshiba-rc-18dh1pv-1-8l",
                code: "SP1010",
                description: "Nồi cơm Toshiba RC-18DH1PV công suất 800W, 8 chế độ nấu, chống dính cao cấp.",
                shot_description: "Nồi cơm điện tử Toshiba 1.8L",
                quantity: 13,
                price: 2390000,
                sale_price: 2190000,
                image: "https://picsum.photos/seed/1010/400/400",
                photo_library: [],
                is_hot: true,
                is_active: true,
                is_deleted: false,
                categories_id: insertedCategories[0]._id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await Product.deleteMany({});
        await Product.insertMany(productsData);
        console.log('✅ Inserted products');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
};

seed();
