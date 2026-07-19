export interface BlogArticle {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string;
  image: string;
  heroImage: string;
  date: string;
  readTime: string;
  author: string;
  sections: {
    heading?: string;
    body: string;
    image?: string;
    imageCaption?: string;
  }[];
  relatedSlugs: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  // ─── 5 bài viết tĩnh gốc ───────────────────────────────────────────────────
  {
    id: 1,
    slug: "visualizing-the-invisible-synesthesia",
    category: "Art & Olfaction",
    title: "Visualizing the Invisible: The Synesthesia Project",
    description:
      "Can you see a scent? We collaborate with three digital artists to translate our latest collection into visual symphonies.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    date: "12 tháng 7, 2025",
    readTime: "8 phút đọc",
    author: "Élise Moreau",
    sections: [
      {
        body: "Có những mùi hương không thể diễn đạt bằng ngôn từ thông thường. Chúng tồn tại ở ranh giới giữa ký ức và cảm xúc, giữa cái hữu hình và cái vô hình. Đó là lý do chúng tôi bắt đầu The Synesthesia Project — một thử nghiệm nghệ thuật hỏi một câu hỏi đơn giản: Bạn có thể *nhìn thấy* một mùi hương không?",
      },
      {
        heading: "Hợp tác với ba nghệ sĩ",
        body: "Chúng tôi mời ba nghệ sĩ kỹ thuật số từ Tokyo, Amsterdam và São Paulo. Mỗi người nhận một chai nước hoa từ bộ sưu tập Dark Series mà không có bất kỳ mô tả nào. Nhiệm vụ của họ: tạo ra một tác phẩm hình ảnh dựa hoàn toàn vào cảm nhận khứu giác. Kết quả là ba thế giới hoàn toàn khác nhau — từ những đường cong ánh sáng vàng của Noir Intense đến những xoáy nước màu tím của Velvet Oud.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9O7RuzAY9dotSVNOmqwGjL6iy6APcFLC7eoYEhOT_mA&s=10",
        imageCaption: "Tác phẩm 'Noir Intense' của nghệ sĩ Yuki Tanaka, Tokyo — 2025",
      },
      {
        heading: "Khoa học đằng sau synesthesia",
        body: "Synesthesia là hiện tượng thần kinh trong đó kích thích một giác quan tự động kích hoạt giác quan khác. Khoảng 4% dân số có khả năng này — họ nghe thấy màu sắc, nhìn thấy âm thanh, hoặc trong trường hợp hiếm hơn, ngửi thấy hình dạng. Dự án này không cố tái tạo synesthesia mà đặt câu hỏi: nếu mùi hương có thể được 'dịch', ngôn ngữ thị giác nào sẽ được chọn?",
      },
      {
        heading: "Triển lãm & bộ sưu tập",
        body: "Ba tác phẩm sẽ được trưng bày tại gallery của chúng tôi từ tháng 9 năm 2025, kèm theo phiên bản giới hạn của Dark Series với bao bì lấy cảm hứng từ mỗi nghệ sĩ. Đây là lần đầu tiên chúng tôi để ngôn ngữ thị giác định hình ngôn ngữ khứu giác — và không phải ngược lại.",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80",
        imageCaption: "Phác thảo bao bì phiên bản giới hạn — sắp ra mắt tháng 9/2025",
      },
    ],
    relatedSlugs: ["scenting-brutalism-cold-air", "molecular-poetry-cedarwood"],
  },
  {
    id: 2,
    slug: "scenting-brutalism-cold-air",
    category: "Space",
    title: "Scenting Brutalism: The Architecture of Cold Air",
    description:
      "Exploring how mineral notes of concrete and cold metal can evoke a sense of grounding peace in modern living.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    date: "28 tháng 6, 2025",
    readTime: "6 phút đọc",
    author: "Marcus de Vries",
    sections: [
      {
        body: "Kiến trúc Brutalist — bê tông thô, hình học lạnh lùng, im lặng nặng nề — là ngôn ngữ thẩm mỹ bị hiểu lầm nhất thế kỷ 20. Nhưng những ai đã từng đứng trong một tòa nhà Brutalist thực sự sẽ biết: có một sự bình yên kỳ lạ ở đó. Câu hỏi của chúng tôi là — mùi hương nào sẽ tái tạo được cảm giác đó?",
      },
      {
        heading: "Ngôn ngữ của đá và kim loại",
        body: "Concrete absolute — một nguyên liệu nước hoa cực kỳ hiếm được chưng cất từ bê tông thực sự — mang theo hơi thở của đất ẩm sau mưa và không khí lạnh của tầng hầm bảo tàng. Kết hợp với ambrette và vetiver cát, chúng tôi tạo ra một hợp chất gợi lên cảm giác đứng giữa một công trình Le Corbusier vào buổi sáng sớm.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
        imageCaption: "Unité d'Habitation, Marseille — nguồn cảm hứng cho Bois Silencieux",
      },
      {
        heading: "Nước hoa như kiến trúc",
        body: "Thú vị nhất là cả kiến trúc Brutalist và nước hoa đều chia sẻ cùng một nguyên tắc cấu trúc: nền tảng phải đủ mạnh để chịu đựng thời gian. Một tòa nhà bê tông cần móng sâu; một nước hoa cần base notes đủ dày. Cả hai đều không quan tâm đến việc làm đẹp ngay lập tức — chúng muốn được hiểu dần dần.",
      },
      {
        heading: "Bois Silencieux — Kết quả",
        body: "Bois Silencieux ra đời từ thử nghiệm này. Hinoki wood và cold incense tạo nên cảm giác của một không gian rộng lớn, im lặng và đầy ánh sáng tự nhiên. Không phải mùi hương để gây ấn tượng từ xa — mà là thứ chỉ bộc lộ hoàn toàn khi bạn đến rất gần.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJMbwQSC1bTCc8zqEM39PIziojviFJfFSGLGMNKBVioA&s=10",
        imageCaption: "Bois Silencieux — ra mắt Thu Đông 2025",
      },
    ],
    relatedSlugs: ["visualizing-the-invisible-synesthesia", "ethics-of-extraction"],
  },
  {
    id: 3,
    slug: "ethics-of-extraction",
    category: "Sustainability",
    title: "The Ethics of Extraction: Preserving Endangered Florals",
    description:
      "A deep dive into our partnership with local conservatories to protect rare botanical species through sustainable technology.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__htyuJgvZWWlJPkJTpMlgM6ej2uVAbxXjAnsUoiIEg&s=10",
    heroImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__htyuJgvZWWlJPkJTpMlgM6ej2uVAbxXjAnsUoiIEg&s=10",
    date: "14 tháng 6, 2025",
    readTime: "10 phút đọc",
    author: "Amara Osei",
    sections: [
      {
        body: "Ngành nước hoa tiêu thụ hàng nghìn tấn nguyên liệu thực vật mỗi năm. Một số loài — như hoa nhài Sambac thuần chủng, hoa huệ tây hoang dã, hay gỗ đàn hương Mysore nguyên bản — đang đứng trước nguy cơ tuyệt chủng thương mại. Chúng tôi quyết định không nhắm mắt làm ngơ.",
      },
      {
        heading: "Hợp tác với vườn bách thảo",
        body: "Từ năm 2022, chúng tôi hợp tác với ba vườn bách thảo tại Pháp, Sri Lanka và Madagascar để xây dựng chương trình nhân giống và bảo tồn các loài hoa đang bị đe dọa. Không chỉ dừng ở việc thu mua công bằng — chúng tôi đầu tư vào cơ sở hạ tầng, đào tạo nông dân địa phương và nghiên cứu phương pháp chiết xuất ít xâm lấn hơn.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__htyuJgvZWWlJPkJTpMlgM6ej2uVAbxXjAnsUoiIEg&s=10",
        imageCaption: "Vườn nhân giống hoa nhài Sambac, Sri Lanka — đối tác từ 2022",
      },
      {
        heading: "Công nghệ headspace: thu mùi hương mà không cắt hoa",
        body: "Một trong những tiến bộ quan trọng nhất là công nghệ headspace — cho phép thu thập phân tử mùi hương từ không khí xung quanh hoa đang sống mà không cần hái hay chưng cất. Kết quả là một bản sao phân tử gần như hoàn hảo của mùi hương tự nhiên, và cây hoa không bị tổn thương.",
      },
      {
        heading: "Cam kết đến 2030",
        body: "Đến năm 2030, chúng tôi cam kết 100% nguyên liệu thực vật đến từ nguồn được chứng nhận bền vững hoặc tổng hợp có trách nhiệm. Đây không phải marketing — đây là điều kiện để chúng tôi còn có nguyên liệu để làm việc trong hai mươi năm nữa.",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80",
        imageCaption: "Chương trình trồng cây phục hồi tại Madagascar — mục tiêu 50,000 cây đến 2027",
      },
    ],
    relatedSlugs: ["molecular-poetry-cedarwood", "lost-art-scented-correspondence"],
  },
  {
    id: 4,
    slug: "molecular-poetry-cedarwood",
    category: "Science",
    title: "The Molecular Poetry of Cedarwood",
    description:
      "Understanding the chemistry that makes wood the backbone of the world's most enduring fragrances.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    date: "2 tháng 6, 2025",
    readTime: "7 phút đọc",
    author: "Dr. Jean-Pierre Volat",
    sections: [
      {
        body: "Cedar — gỗ tuyết tùng — là một trong những nguyên liệu lâu đời nhất trong lịch sử nước hoa. Người Ai Cập cổ đại dùng nó để ướp xác. Người Babylon đốt nó trong các nghi lễ tôn giáo. Hàng nghìn năm sau, nó vẫn là base note không thể thiếu của hàng trăm thành phần nước hoa hiện đại. Tại sao?",
      },
      {
        heading: "Phân tử cedrol và thudopsene",
        body: "Sức hút của cedarwood nằm ở hai phân tử chủ chốt: cedrol và thudopsene. Cedrol — một sesquiterpene alcohol — mang lại sự ấm áp, gần gũi và hơi ngọt đặc trưng. Thudopsene tạo nên chiều sâu gỗ khô và sắc nét hơn. Sự kết hợp của hai phân tử này, theo tỷ lệ khác nhau tùy loài cedar, tạo ra những nhân vật hoàn toàn khác nhau.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
        imageCaption: "Rừng cedar Virginia — nguồn cung cấp Virginiana cedar cho bộ sưu tập của chúng tôi",
      },
      {
        heading: "Cedar trong bộ sưu tập của chúng tôi",
        body: "Chúng tôi sử dụng ba loại cedar khác nhau: Atlas cedar từ Morocco (ấm và nhựa cây), Virginia cedar từ Mỹ (khô và sắc nét), và Himalayan cedar (trầm mặc và tâm linh). Mỗi loại đóng một vai trò khác nhau. Atlas cedar là xương sống của Noir Intense. Virginia cedar tạo độ sắc nét cho Bleu de Chanel trong bộ sưu tập đa thương hiệu. Himalayan cedar — hiếm và đắt nhất — được dành riêng cho Velvet Oud.",
      },
      {
        heading: "Gỗ như nhân vật, không phải nền",
        body: "Lỗi phổ biến nhất trong pha chế nước hoa là đối xử với cedar như một tấm vải nền trung tính để đặt các nốt hương khác lên. Cedar không phải nền — nó là nhân vật. Khi được dùng đúng cách, nó đối thoại với từng nốt hương khác, thay đổi và được thay đổi bởi chúng.",
        image: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=1200&q=80",
        imageCaption: "Phòng thí nghiệm pha chế — nơi cedar gặp gỡ các nguyên liệu khác",
      },
    ],
    relatedSlugs: ["scenting-brutalism-cold-air", "visualizing-the-invisible-synesthesia"],
  },
  {
    id: 5,
    slug: "lost-art-scented-correspondence",
    category: "Lifestyle",
    title: "The Lost Art of Scented Correspondence",
    description:
      "Why the intimacy of a perfumed envelope remains one of history's most powerful gestures of connection.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80",
    date: "20 tháng 5, 2025",
    readTime: "5 phút đọc",
    author: "Céleste Fontaine",
    sections: [
      {
        body: "Trước khi có email, trước khi có điện thoại, người ta gửi cho nhau những phong bì thơm mùi hương. Một bức thư tẩm nước hoa hoa hồng từ Paris đến Vienna vào thế kỷ 18 mang theo không chỉ chữ viết — mà cả hơi thở của người viết, không khí của căn phòng nơi bức thư được viết, và một tuyên ngôn tình cảm không cần từ ngữ.",
      },
      {
        heading: "Lịch sử của thư thơm",
        body: "Thực hành tẩm hương cho thư từ có nguồn gốc từ ít nhất thế kỷ 16, khi các quý bà Pháp và Ý dùng nước hoa hoa nhài hoặc hoa cam để phân biệt thư của mình với những thư khác. Đến thế kỷ 19, nó trở thành một hình thức ngôn ngữ mã hóa — mỗi loài hoa, mỗi mùi hương mang một thông điệp cụ thể trong hệ thống 'floriography'.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
        imageCaption: "Bộ sưu tập thư từ thế kỷ 19 tại Thư viện Quốc gia Pháp",
      },
      {
        heading: "Tại sao nó biến mất",
        body: "Thư thơm biến mất không phải vì con người mất đi sự lãng mạn — mà vì tốc độ. Điện tín, rồi điện thoại, rồi email, rồi tin nhắn tức thì: mỗi bước tiến về tốc độ là một bước lùi về chiều sâu cảm giác. Chúng ta giao tiếp nhanh hơn bao giờ hết và ít hiện diện hơn bao giờ hết trong từng lời nói.",
      },
      {
        heading: "Phục hồi một truyền thống",
        body: "Chúng tôi ra mắt bộ giấy thư 'Correspondance' — được tẩm nhẹ một trong ba mùi hương: Rose Blanche (tình yêu lãng mạn), Noir Intense (kính trọng và ngưỡng mộ), hoặc Aqua Unisex (tình bạn và kết nối). Một bức thư tay, trên giấy thơm, vẫn là một trong những cử chỉ kết nối mạnh mẽ nhất mà con người có thể làm cho nhau.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        imageCaption: "Bộ giấy thư Correspondance — ra mắt tháng 8/2025",
      },
    ],
    relatedSlugs: ["ethics-of-extraction", "visualizing-the-invisible-synesthesia"],
  },

  // ─── 6 bài viết mới tương ứng với Olfactory Archetypes ───────────────────
  {
    id: 6,
    slug: "archetype-smoked-vetiver",
    category: "Ingredient Focus",
    title: "Smoked Vetiver: The Earth Beneath the Flame",
    description:
      "Vetiver carries the memory of rain-soaked soil and open fire. We trace this ancient root from the grasslands of Haiti to our atelier.",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1600&q=80",
    date: "5 tháng 7, 2025",
    readTime: "7 phút đọc",
    author: "Dr. Jean-Pierre Volat",
    sections: [
      {
        body: "Vetiver không phải là một mùi hương — nó là một địa điểm. Những ai đã từng ngửi rễ vetiver tươi sẽ nhận ra ngay: đất đỏ sau mưa, khói từ một đống lửa xa xa, và phía dưới tất cả là một thứ gì đó trầm, cổ xưa, gần như khoáng vật. Đó là lý do vetiver khói là một trong những nguyên liệu phức tạp nhất và trung thành nhất mà chúng tôi làm việc cùng.",
      },
      {
        heading: "Hành trình từ rễ đến nước hoa",
        body: "Vetiver được trồng chủ yếu ở Haiti, Java và Réunion — mỗi vùng đất cho ra một nhân cách khác nhau. Vetiver Haiti nổi tiếng về chiều sâu khói và đất; Java cho ra loại nhẹ hơn với nốt gỗ; Réunion mang hơi hướng hoa cỏ tinh tế. Chúng tôi chưng cất rễ bằng hơi nước trong 18 đến 24 giờ để chiết xuất tinh dầu — quá trình này không thể rút ngắn nếu muốn giữ trọn phổ phân tử.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
        imageCaption: "Rễ vetiver phơi khô trước khi chưng cất — Haiti",
      },
      {
        heading: "Tại sao chúng tôi hun khói nó",
        body: "Bước hun khói là nơi chúng tôi đưa ra một quyết định có chủ ý. Vetiver tự nhiên đã có hơi hướng khói nhẹ từ các phân tử khusimol và isovalencenol — chúng tôi khuếch đại chiều này bằng cách xông khói gỗ sồi nhẹ trước khi pha trộn. Kết quả là một nguyên liệu vừa quen vừa lạ: đất đai quen thuộc, nhưng mang theo ký ức của lửa.",
      },
      {
        heading: "Smoked Vetiver trong bộ sưu tập",
        body: "Nguyên liệu này là trụ cột của hai sáng tác trong bộ sưu tập Archetypes: Terre Noire và Cendres du Soir. Ở Terre Noire, nó là nền tảng tối của toàn bộ kim tự tháp mùi hương. Ở Cendres du Soir, nó được đẩy lên thành nhân vật chính — một nước hoa tối giản chỉ có ba thành phần, trong đó vetiver chiếm không gian đến 60%.",
        image: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=1200&q=80",
        imageCaption: "Cendres du Soir — khi vetiver là toàn bộ câu chuyện",
      },
    ],
    relatedSlugs: ["archetype-ancient-resin", "molecular-poetry-cedarwood"],
  },
  {
    id: 7,
    slug: "archetype-ancient-resin",
    category: "Ingredient Focus",
    title: "Ancient Resin: The Language of Sacred Smoke",
    description:
      "Frankincense, myrrh, labdanum — resins are the oldest perfumery materials on earth. We explore what makes them timeless.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJKAx_T_e9r6qfkItNyyPv4s4viAzq_L3thp2h4W4k9w&s=10",
    heroImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJKAx_T_e9r6qfkItNyyPv4s4viAzq_L3thp2h4W4k9w&s=10",
    date: "19 tháng 6, 2025",
    readTime: "9 phút đọc",
    author: "Amara Osei",
    sections: [
      {
        body: "Nhựa cây là ngôn ngữ pha chế nước hoa cổ xưa nhất còn được dùng đến ngày nay. Frankincense đã được đốt trong các ngôi đền Ai Cập từ 3000 năm trước Công nguyên. Myrrh xuất hiện trong các văn bản y học Mesopotamia trước cả chữ viết có hệ thống. Labdanum được người Hy Lạp cổ đại thu hoạch từ lông dê — con vật gặm cỏ dã tràng và nhựa cây bám vào lông chúng. Chúng ta thừa hưởng toàn bộ di sản đó trong một chai nước hoa.",
      },
      {
        heading: "Ba loại nhựa cây trụ cột",
        body: "Frankincense (nhũ hương) từ Oman và Somalia mang hương thơm thanh khiết, không khí lạnh và trầm lặng của nhà thờ. Myrrh từ Ethiopia và Yemen đậm đà hơn, gần với da người và đất ẩm. Labdanum từ vùng Địa Trung Hải — được chưng cất từ cây Cistus ladanifer — mang mùi hổ phách ngọt ngào và da thuộc ấm áp. Ba loại này tạo thành một tam giác nhựa cây không thể thay thế trong phòng thí nghiệm của chúng tôi.",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80",
        imageCaption: "Hạt frankincense Oman loại hảo hạng — thu hoạch tháng 3 hàng năm",
      },
      {
        heading: "Tại sao nhựa cây tồn tại được hàng nghìn năm",
        body: "Nhựa cây bền vững không phải vì chúng không thay đổi — mà vì chúng thay đổi đúng cách. Các phân tử triterpene trong frankincense tiến hóa chậm khi tiếp xúc với không khí, tạo ra những chiều sâu mới theo thời gian. Đây là lý do một chai nước hoa nhựa cây được bảo quản tốt sẽ trở nên phức tạp hơn, không nhạt hơn, sau nhiều năm.",
      },
      {
        heading: "Ancient Resin Accord — pha trộn của chúng tôi",
        body: "Bộ sưu tập Ancient Resin Accord được xây dựng quanh một blend đặc biệt: frankincense Oman, myrrh Ethiopia, labdanum Tây Ban Nha, và một nốt benzoin Laos nhỏ để thêm chiều ấm ngọt. Không có một nốt hương nào chiếm ưu thế — đây là một hợp tấu, không phải một độc tấu.",
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80",
        imageCaption: "Ancient Resin Accord — phiên bản mùa thu 2025",
      },
    ],
    relatedSlugs: ["archetype-smoked-vetiver", "archetype-sandalwood"],
  },
  {
    id: 8,
    slug: "archetype-highland-lavender",
    category: "Ingredient Focus",
    title: "Highland Lavender: The Scent of Altitude",
    description:
      "True lavender only grows above 800 metres. We explore why elevation transforms this familiar flower into something extraordinary.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQms7H-rohIGVXMGswOospL49KfBax9mDIGFMr4iluH3g&s=10",
    heroImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQms7H-rohIGVXMGswOospL49KfBax9mDIGFMr4iluH3g&s=10",
    date: "30 tháng 5, 2025",
    readTime: "6 phút đọc",
    author: "Élise Moreau",
    sections: [
      {
        body: "Lavender là loài hoa quen thuộc đến mức người ta quên mất nó có thể phi thường đến mức nào. Phần lớn lavender trên thị trường là lavandin — giống lai được trồng ở độ cao thấp, cho năng suất cao, mùi hương đơn điệu và đôi khi gắt. Lavande vraie — lavender thực sự — chỉ sống trên cao nguyên Provence từ 800 đến 1800 mét. Và ở đó, mọi thứ khác đi hoàn toàn.",
      },
      {
        heading: "Tại sao độ cao tạo nên sự khác biệt",
        body: "Ở độ cao, cây lavender phát triển chậm hơn dưới áp lực của khí hậu khắc nghiệt — nhiệt độ chênh lệch lớn giữa ngày và đêm, đất nghèo dinh dưỡng, tia UV cao hơn. Để sinh tồn, cây tổng hợp nhiều hợp chất thơm hơn, đặc biệt là linalool và linalyl acetate tinh khiết hơn. Kết quả: mùi hương trong sáng, thảo mộc và hơi long não — rất khác với mùi xà phòng thông thường của lavandin.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
        imageCaption: "Cánh đồng lavender cao nguyên Valensole, Provence — tháng 7",
      },
      {
        heading: "Thu hoạch bằng tay",
        body: "Địa hình dốc của cao nguyên không cho phép máy móc thu hoạch. Mỗi bông lavender được cắt bằng tay vào buổi sáng sớm, trước khi nhiệt độ tăng và tinh dầu bốc hơi. Đây là lao động nặng nhọc, và nó phản ánh trong giá — nhưng cũng phản ánh trong chất lượng.",
      },
      {
        heading: "Lavender trong bộ sưu tập Archetypes",
        body: "Highland Lavender là nguyên liệu trung tâm của Clairière — một nước hoa floral-aromatic lấy cảm hứng từ buổi sáng trên cao nguyên Provence. Lavender cao nguyên kết hợp với rosemary Corsica, bergamot Calabria và một nốt vetiver nhẹ để giữ toàn bộ cấu trúc đứng vững. Không lãng mạn sến, không thảo dược y tế — chỉ là không khí trong và đất thơm.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
        imageCaption: "Clairière — ra mắt Xuân Hè 2026",
      },
    ],
    relatedSlugs: ["archetype-bitter-bergamot", "ethics-of-extraction"],
  },
  {
    id: 9,
    slug: "archetype-bitter-bergamot",
    category: "Ingredient Focus",
    title: "Bitter Bergamot: Sunlight Pressed Into Skin",
    description:
      "The rind of a Calabrian bergamot holds more complexity than any other citrus. We document a harvest that can only happen once a year.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxMdfC1MN1eLPBymaHTM83hXvoyVXToC0jSjP3S4JVA&s=10",
    heroImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxMdfC1MN1eLPBymaHTM83hXvoyVXToC0jSjP3S4JVA&s=10",
    date: "10 tháng 5, 2025",
    readTime: "5 phút đọc",
    author: "Marcus de Vries",
    sections: [
      {
        body: "Bergamot là loại quả kỳ lạ nhất trong họ cam quýt. Không ai ăn nó tươi — quá đắng, gần như không ăn được. Nhưng tinh dầu trong vỏ của nó là một trong những nguyên liệu nước hoa được sử dụng rộng rãi nhất thế giới, xuất hiện trong ít nhất 50% các nước hoa fine fragrance. Và 90% bergamot chất lượng cao nhất chỉ đến từ một dải hẹp 80 km dọc bờ biển Calabria, miền Nam Italy.",
      },
      {
        heading: "Mùa thu hoạch duy nhất",
        body: "Bergamot chỉ chín vào tháng 11 đến tháng 2 — và chỉ được thu hoạch một lần mỗi năm. Tinh dầu được chiết xuất ngay lập tức từ vỏ tươi bằng phương pháp ép lạnh (cold expression), không qua chưng cất nhiệt. Đây là lý do bergamot chất lượng cao có mùi sống động và tươi đến vậy — không có nhiệt độ nào làm biến đổi cấu trúc phân tử.",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80",
        imageCaption: "Quả bergamot Calabria chín trên cây — tháng 12",
      },
      {
        heading: "Bergamot FCF và câu hỏi an toàn",
        body: "Bergamot tự nhiên chứa bergapten — một furanocoumarin có thể gây phản ứng da khi tiếp xúc ánh nắng. Tiêu chuẩn IFRA hiện tại yêu cầu sử dụng bergamot FCF (furanocoumarin-free) trong hầu hết ứng dụng. Chúng tôi dùng cả hai: bergamot tự nhiên trong các sáng tác dành cho mùa đông và ban đêm; FCF trong bộ sưu tập mùa hè.",
      },
      {
        heading: "Bitter Bergamot trong bộ sưu tập",
        body: "Đặc tính đắng của bergamot — thường bị che đi trong các nước hoa thương mại — là điều chúng tôi chủ ý khai thác. Kết hợp với neroli Grasse và petit grain Morocco, chúng tôi tạo ra Zeste Amer — một nước hoa citrus khắc nghiệt và trưởng thành. Không ngọt, không dễ chịu ngay từ đầu — nhưng sau 20 phút trên da, nó mở ra thành thứ gì đó ấm áp và không thể thiếu.",
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80",
        imageCaption: "Zeste Amer — khi đắng là một lựa chọn thẩm mỹ",
      },
    ],
    relatedSlugs: ["archetype-highland-lavender", "archetype-damask-rose"],
  },
  {
    id: 10,
    slug: "archetype-damask-rose",
    category: "Ingredient Focus",
    title: "Damask Rose: The Queen That Only Blooms at Dawn",
    description:
      "Every harvest begins before the sun rises. We travel to Bulgaria's Rose Valley to witness the fleeting peak of Rosa damascena.",
    image: "https://www.thisisdimashq.com/wp-content/uploads/2025/09/530350225_122133517022864116_8041839167718942976_n-1024x576.jpg",
    heroImage: "https://www.thisisdimashq.com/wp-content/uploads/2025/09/530350225_122133517022864116_8041839167718942976_n-1024x576.jpg",
    date: "25 tháng 4, 2025",
    readTime: "8 phút đọc",
    author: "Céleste Fontaine",
    sections: [
      {
        body: "Một kg tinh dầu hoa hồng Damask cần từ 3 đến 5 tấn cánh hoa. Mỗi bông hoa phải được hái bằng tay trước 10 giờ sáng, trước khi nhiệt độ tăng và tinh dầu bắt đầu bốc hơi. Mùa hái hoa chỉ kéo dài từ 3 đến 4 tuần mỗi năm. Đây là lý do dầu hoa hồng thuần chất là một trong những nguyên liệu nước hoa đắt nhất thế giới — và không có gì thay thế được nó hoàn toàn.",
      },
      {
        heading: "Thung lũng Hoa hồng Bulgaria",
        body: "Thung lũng Kazanlak ở Bulgaria — được gọi là Thung lũng Hoa hồng — cung cấp khoảng 70% sản lượng dầu hoa hồng Damask toàn cầu. Đất đỏ, khí hậu ôn hòa và kỹ thuật canh tác được truyền từ thế kỷ 17 tạo ra điều kiện không thể tái tạo ở nơi khác. Chúng tôi hợp tác trực tiếp với ba gia đình trồng hoa lâu đời nhất vùng — không qua trung gian.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
        imageCaption: "Thung lũng Kazanlak lúc bình minh — bắt đầu một ngày hái hoa",
      },
      {
        heading: "Rose Otto và Rose Absolute — hai nhân vật khác nhau",
        body: "Cùng một loài hoa, hai phương pháp chiết xuất cho ra hai nguyên liệu hoàn toàn khác nhau. Rose Otto — chưng cất hơi nước — cho ra tinh dầu thanh khiết, trong sáng, hơi sáp và rất trung thực với mùi hoa tươi. Rose Absolute — chiết xuất dung môi — đậm đà hơn, phức tạp hơn, với chiều sâu mật ong và thuốc lá nhẹ. Chúng tôi dùng cả hai trong các sáng tác khác nhau.",
      },
      {
        heading: "Damask Rose trong bộ sưu tập",
        body: "Rose Blanche sử dụng Rose Otto Bulgaria làm trung tâm — xung quanh là geranium Bourbon, lychee và patchouli nhẹ. Đây là hoa hồng của ánh sáng ban ngày và sự trong sáng. Rose Profonde dùng Rose Absolute kết hợp với oud Assam và ambrette — hoa hồng của đêm và bí ẩn. Cùng một loài hoa, hai cuộc sống hoàn toàn khác nhau.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
        imageCaption: "Rose Blanche và Rose Profonde — hai mặt của Damask",
      },
    ],
    relatedSlugs: ["archetype-highland-lavender", "ethics-of-extraction"],
  },
  {
    id: 11,
    slug: "archetype-sandalwood",
    category: "Ingredient Focus",
    title: "Sandalwood: The Wood That Holds Everything Together",
    description:
      "Mysore sandalwood has been overharvested for decades. We explore sustainable alternatives and what is irreplaceable about the original.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    date: "8 tháng 4, 2025",
    readTime: "8 phút đọc",
    author: "Dr. Jean-Pierre Volat",
    sections: [
      {
        body: "Đàn hương Mysore — Santalum album từ miền Nam Ấn Độ — từng là tiêu chuẩn vàng của nước hoa toàn cầu. Mùi hương của nó là sự kết hợp hiếm có: ấm áp và sữa, gỗ và da, hoa và đất — tất cả trong một. Nhưng hàng thập kỷ khai thác không kiểm soát đã đưa loài cây này đến bờ vực. Hôm nay, Mysore sandalwood thuần chất gần như không còn trên thị trường — và nếu có, giá của nó khiến ngay cả các thương hiệu nước hoa lớn cũng phải cân nhắc.",
      },
      {
        heading: "Các lựa chọn thay thế bền vững",
        body: "Santalum spicatum từ Tây Australia là lựa chọn được chứng nhận bền vững phổ biến nhất hiện nay — khô hơn, ít sữa hơn Mysore, nhưng đứng vững và dễ làm việc. Santalum austrocaledonicum từ New Caledonia gần hơn với Mysore về mặt hóa học. Và gần đây, Santalum paniculatum từ Hawaii — được trồng dưới sự giám sát chặt chẽ — đang nổi lên như một nhân vật mới trong câu chuyện đàn hương.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
        imageCaption: "Rừng Santalum spicatum tại Tây Australia — được chứng nhận FSC",
      },
      {
        heading: "Santalol và lý do đàn hương giữ mùi",
        body: "Phân tử chủ chốt của đàn hương là alpha-santalol và beta-santalol — hai sesquiterpene alcohol có khả năng bám dính da đặc biệt mạnh. Đây là lý do đàn hương là một fixative lý tưởng: nó không chỉ có mùi hương của chính nó mà còn 'giữ' các mùi hương khác lại trên da, kéo dài sức sống của toàn bộ hợp chất.",
      },
      {
        heading: "Sandalwood trong bộ sưu tập Archetypes",
        body: "Chúng tôi sử dụng một blend của hai loại: Santalum spicatum Australia để tạo khung gỗ bền vững, và một lượng nhỏ Mysore từ nguồn được chứng nhận hợp pháp để thêm chiều sâu sữa không thể tái tạo. Kết quả là Santal Doux — nước hoa gỗ đơn giản nhất và trung thực nhất chúng tôi từng làm. Không có gì che giấu, không có gì thêm vào để gây ấn tượng. Chỉ là gỗ và thời gian.",
        image: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=1200&q=80",
        imageCaption: "Santal Doux — khi sự giản dị là tham vọng lớn nhất",
      },
    ],
    relatedSlugs: ["archetype-ancient-resin", "molecular-poetry-cedarwood"],
  },
  {
    id: 12,
    slug: "archetype-oud-assam",
    category: "Ingredient Focus",
    title: "Oud Assam: Liquid Gold of the Forest",
    description:
      "Oud is the most valuable raw material in perfumery. We follow the slow transformation of infected agarwood into liquid gold.",
    image: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=1600&q=80",
    date: "2 thang 4, 2025",
    readTime: "9 phut doc",
    author: "Dr. Jean-Pierre Volat",
    sections: [
      {
        body: "Oud khong phai la mot mui huong ma sinh ra tu su khoe manh, no sinh ra tu ton thuong. Khi cay tram huong Aquilaria bi nhiem mot loai nam dac biet, no tiet ra mot loai nhua sam mau de tu bao ve. Chinh phan go tam nhua do, sau hang chuc nam, tro thanh oud. Day la ly do oud vua quy vua mang mot chieu sau gan nhu khong the mo ta bang ngon tu.",
      },
      {
        heading: "Vi sao oud dat den vay",
        body: "Chi khoang 2 phan tram cay tram huong hoang da tu nhien tao ra nhua oud, va qua trinh hinh thanh keo dai hang thap ky. Su khan hiem cong voi nhu cau khong ngung tang o Trung Dong va chau A khien oud tro thanh nguyen lieu dat nhat nganh nuoc hoa, co the vuot ca vang tinh theo trong luong.",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80",
        imageCaption: "Go tram huong chua nhua oud, Assam - An Do",
      },
      {
        heading: "Oud Assam va tinh cach rieng",
        body: "Oud tu vung Assam va Bac An mang tinh cach am, mat ong va hoi da thuoc, khac voi oud Campuchia sang va ngot hon hay oud Borneo mang huong go tuoi. Chung toi chon Assam cho cac sang tac can chieu sau tram va toi.",
      },
      {
        heading: "Oud trong bo suu tap Archetypes",
        body: "Nuoc hoa Nuit Boisee dat oud Assam lam trung tam, bao quanh boi hoa hong Damask va mot chut saffron. Day khong phai mui huong de tiep can ngay, no doi hoi thoi gian, nhung mot khi da quen thi kho ma quay lai voi bat ky thu gi khac.",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=80",
        imageCaption: "Nuit Boisee - khi oud gap hoa hong",
      },
    ],
    relatedSlugs: ["archetype-ancient-resin", "archetype-sandalwood"],
  },
  {
    id: 13,
    slug: "archetype-ambergris",
    category: "Ingredient Focus",
    title: "Ambergris: The Ocean\'s Slow Alchemy",
    description:
      "Born in the sea and aged by sun and salt for years, ambergris is one of perfumery\'s strangest and most magical materials.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600&q=80",
    date: "22 thang 3, 2025",
    readTime: "7 phut doc",
    author: "Amara Osei",
    sections: [
      {
        body: "Ho phach bien - ambergris - co mot nguon goc ky la nhat trong nganh nuoc hoa. No hinh thanh trong duong ruot ca nha tang, roi troi noi tren dai duong hang nam troi. Duoi tac dong cua nuoc bien, anh nang va thoi gian, khoi vat tho ban dau bien thanh mot chat sap thom co mui am, man va ngot dieu ky.",
      },
      {
        heading: "Alchemy cua bien ca",
        body: "Ambergris tuoi gan nhu khong the ngui duoc. Chi sau nhieu nam oxy hoa tu nhien tren mat bien, no moi phat trien mui huong dac trung: mot su pha tron giua da nguoi am, khoi bien man va mot net ngot gan nhu khong the goi ten. Day la vi du hoan hao cho viec thoi gian la mot thanh phan trong nuoc hoa.",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
        imageCaption: "Bo bien noi ambergris duoc tim thay sau nhieu nam troi dat",
      },
      {
        heading: "Ambroxan va cac lua chon co dao duc",
        body: "Vi ambergris tu nhien vua hiem vua lien quan den viec bao ton ca nha tang, hau het nganh nuoc hoa hien dai dung Ambroxan - mot phan tu tong hop tai tao net am, mat va toa cua ambergris ma khong anh huong den dong vat. Chung toi dung Ambroxan cho gan nhu toan bo cac sang tac.",
      },
      {
        heading: "Ambergris trong bo suu tap",
        body: "Peau de Sel su dung Ambroxan lam nen, ket hop voi muoi bien va mot chut xa huong trang, tai tao cam giac lan da am sau mot ngay ngoai bien. Day la mot trong nhung mui huong gan gui nhat ma chung toi tung tao ra.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
        imageCaption: "Peau de Sel - mui huong cua lan da va bien",
      },
    ],
    relatedSlugs: ["archetype-sea-salt", "archetype-sandalwood"],
  },
  {
    id: 14,
    slug: "archetype-tonka-bean",
    category: "Ingredient Focus",
    title: "Tonka Bean: Warmth With a Shadow",
    description:
      "Vanilla, almond, tobacco and hay in a single seed. Tonka bean is the warmest note in perfumery, and the most misunderstood.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&q=80",
    date: "11 thang 3, 2025",
    readTime: "6 phut doc",
    author: "Celeste Fontaine",
    sections: [
      {
        body: "Hat tonka - hat cua cay Dipteryx odorata vung Nam My - la mot trong nhung nguyen lieu am ap nhat trong bang mau nuoc hoa. Trong mot hat nho be, ban co the tim thay vani, hanh nhan, thuoc la, co kho va mot net ngot am gan nhu am thuc. Nhung phia sau su am ap do luon co mot bong toi nhe.",
      },
      {
        heading: "Coumarin - phan tu khai sinh nuoc hoa hien dai",
        body: "Tonka giau coumarin, phan tu tao nen mui co kho vua cat. Nam 1882, coumarin tong hop dau tien duoc dung trong Fougere Royale, mo ra ky nguyen nuoc hoa hien dai. Nhu vay tonka khong chi la mot nguyen lieu, no la mot phan cua lich su nghe pha che.",
        image: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=1200&q=80",
        imageCaption: "Hat tonka phoi kho truoc khi ngam chiet",
      },
      {
        heading: "Tonka trong bo suu tap",
        body: "Ombre Douce dat tonka canh ben cafe rang va mot chut oakmoss, tao ra mot mui huong am nhu buoi chieu mua dong. Tonka o day khong ngot gat, no duoc giu lai boi net kho va toi de tro nen truong thanh.",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80",
        imageCaption: "Ombre Douce - am ap co chieu sau",
      },
    ],
    relatedSlugs: ["archetype-tobacco-leaf", "archetype-sandalwood"],
  },
  {
    id: 15,
    slug: "archetype-iris-pallida",
    category: "Ingredient Focus",
    title: "Iris Pallida: The Most Expensive Silence",
    description:
      "Iris butter takes six years to make and costs more than gold. We explore why patience is the true ingredient.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80",
    date: "28 thang 2, 2025",
    readTime: "7 phut doc",
    author: "Elise Moreau",
    sections: [
      {
        body: "Iris - hay chinh xac hon la orris - khong den tu hoa ma tu re cu. Va de re cu iris toa huong, no phai duoc phoi kho va u trong it nhat ba nam, doi khi den sau nam. Ket qua la orris butter, mot trong nhung nguyen lieu dat nhat the gioi, dat hon vang tinh theo trong luong.",
      },
      {
        heading: "Sau nam cho mot mui huong",
        body: "Trong thoi gian u, cac phan tu irone dan hinh thanh, tao nen mui huong dac trung cua iris: bot phan, go lanh, mot chut rau qua va mot net kim loai tinh khiet. Khong co cach nao rut ngan qua trinh nay. Iris day su kien nhan cua chinh no.",
        image: "https://images.unsplash.com/photo-1490750967868-88df5691cc87?w=1200&q=80",
        imageCaption: "Re cu iris pallida phoi kho tai Tuscany",
      },
      {
        heading: "Iris trong bo suu tap",
        body: "Poudre Grise dua iris pallida len vi tri trung tam, bao quanh boi xa huong trang va mot chut karot seed. Day la mui huong cua su im lang sang trong, khong pho truong, chi danh cho nhung ai chiu dung lai du lau de cam nhan.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
        imageCaption: "Poudre Grise - su im lang dat gia",
      },
    ],
    relatedSlugs: ["archetype-damask-rose", "archetype-highland-lavender"],
  },
  {
    id: 16,
    slug: "archetype-sea-salt",
    category: "Ingredient Focus",
    title: "Sea Salt: The Scent of Distance",
    description:
      "How do you bottle the horizon? We explore the molecules that recreate salt, spray and open air.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    date: "16 thang 2, 2025",
    readTime: "5 phut doc",
    author: "Marcus de Vries",
    sections: [
      {
        body: "Muoi bien khong co mui theo nghia hoa hoc thong thuong. Cai ma chung ta goi la mui bien thuc ra la mot hop tau cua tao bien, khoang chat am va khong khi mo rong. Tai tao duoc cam giac do la mot trong nhung thu thach thu vi nhat cua nghe pha che hien dai.",
      },
      {
        heading: "Phan tu cua khong gian",
        body: "Cac phan tu nhu Calone tao ra net dua hau va khong khi bien, trong khi Ambroxan va mot chut xa huong tao cam giac man va toa rong. Ket hop lai, chung goi len khong phai mui cua nuoc, ma mui cua khoang cach - cua duong chan troi.",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80",
        imageCaption: "Duong chan troi - nguon cam hung cho Grand Large",
      },
      {
        heading: "Sea Salt trong bo suu tap",
        body: "Grand Large ket hop muoi bien voi bergamot va mot nen go nhat, tao ra mot mui huong thoang, sang va rong. Day la mui huong cua tu do, cua nhung buoi sang mo cua so nhin ra bien.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
        imageCaption: "Grand Large - mui huong cua tu do",
      },
    ],
    relatedSlugs: ["archetype-ambergris", "archetype-bitter-bergamot"],
  },
  {
    id: 17,
    slug: "archetype-tobacco-leaf",
    category: "Ingredient Focus",
    title: "Tobacco Leaf: Honeyed Smoke and Old Libraries",
    description:
      "Cured tobacco leaf smells of honey, dried fruit and old paper. We trace its journey from field to fragrance.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
    date: "4 thang 2, 2025",
    readTime: "6 phut doc",
    author: "Dr. Jean-Pierre Volat",
    sections: [
      {
        body: "La thuoc la sau khi u len men khong con lien quan gi den dieu thuoc. No mang mui mat ong, trai cay kho, da thuoc va giay cu - mot mui huong am va co dien nhu buoc vao mot thu vien lau nam. Day la mot trong nhung nguyen lieu am nam tinh va sang trong nhat.",
      },
      {
        heading: "Nghe thuat u la",
        body: "Qua trinh curing - u va len men la thuoc la - moi la nơi mui huong that su hinh thanh. Duong tu nhien trong la caramel hoa, cac hop chat thom phat trien chieu sau mat ong va co kho. Loai la va cach u quyet dinh hoan toan tinh cach cuoi cung.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
        imageCaption: "La thuoc la u len men - buoc quyet dinh mui huong",
      },
      {
        heading: "Tobacco trong bo suu tap",
        body: "Cuir et Miel ket hop la thuoc la voi tonka va mot net da thuoc, tao ra mot mui huong am nhu mot chiec ghe da trong thu vien. Day la mui huong cua mua thu, cua sach va cua nhung buoi toi dai.",
        image: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=1200&q=80",
        imageCaption: "Cuir et Miel - khoi ngot va giay cu",
      },
    ],
    relatedSlugs: ["archetype-tonka-bean", "archetype-ancient-resin"],
  },
];

/**
 * Map từ tên Archetype → slug bài viết tương ứng.
 * Dùng trong Blog.tsx để link slider về trang chi tiết bài viết.
 */
export const ARCHETYPE_SLUG_MAP: Record<string, string> = {
  "Smoked Vetiver":   "archetype-smoked-vetiver",
  "Ancient Resin":    "archetype-ancient-resin",
  "Highland Lavender":"archetype-highland-lavender",
  "Bitter Bergamot":  "archetype-bitter-bergamot",
  "Damask Rose":      "archetype-damask-rose",
  "Sandalwood":       "archetype-sandalwood",
  "Oud Assam":        "archetype-oud-assam",
  "Ambergris":        "archetype-ambergris",
  "Tonka Bean":       "archetype-tonka-bean",
  "Iris Pallida":     "archetype-iris-pallida",
  "Sea Salt":         "archetype-sea-salt",
  "Tobacco Leaf":     "archetype-tobacco-leaf",
};

export interface ArchetypeCard {
  name: string;
  image: string;
  slug: string;
}

const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(ARCHETYPE_SLUG_MAP).map(([name, slug]) => [slug, name]),
);

// Slider Olfactory Archetypes lay truc tiep tu bai viet -> dung dung anh trong blogData
export const ARCHETYPES: ArchetypeCard[] = BLOG_ARTICLES.filter((a) =>
  a.slug.startsWith("archetype-"),
).map((a) => ({
  name: SLUG_TO_NAME[a.slug] ?? a.title,
  image: a.image,
  slug: a.slug,
}));

