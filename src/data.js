const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`

export const images = {
  hero: u('photo-1517248135467-4c7edcad34c4'),
  pour: u('photo-1495474472287-4d71bcdd2085'),
  latte: u('photo-1509042239860-f550ce710b93'),
  about: u('photo-1554118811-1e0d58224f24'),
  lounge: u('photo-1559339352-11d035aa65de'),
  night: u('photo-1414235077428-338989a2e8c0'),
  friends: u('photo-1521017432531-fbd92d768814'),
  dark: u('photo-1550966871-3ed3cdb5ed0c'),
  bar: u('photo-1514933651103-005eec06c04b'),
  breakfast: u('photo-1533089860892-a7c6f0a88666'),
  toast: u('photo-1482049016688-2d3e1b311543'),
  burger: u('photo-1568901346375-23c9450c58cd'),
  fries: u('photo-1573080496219-bb080dd4f877'),
  sandwich: u('photo-1528735602780-2552fd46c7af'),
  chicken: u('photo-1626082927389-6cd097cdc6ec'),
  crepe: u('photo-1519676867240-f03562e64548'),
  sweet: u('photo-1533134486753-c833f0ed4866'),
  dessert: u('photo-1488477181946-6428a0291777'),
  shisha: u('photo-1514933651103-005eec06c04b'),
  hot: u('photo-1498804103079-a6351b050096'),
  turkish: u('photo-1514432324607-a09d9b4aefdd'),
  iced: u('photo-1461023058943-07fcbe16d735'),
  frap: u('photo-1572490122747-3968b75cc699'),
  juice: u('photo-1600271886742-f049cd451bba'),
  orange: u('photo-1613478223719-2ab802602423'),
  mojito: u('photo-1513558161293-cdaf765ed2fd'),
  shake: u('photo-1579954115545-a95591f28bfc'),
  cocktail: u('photo-1544145945-f90425340c7e'),
  soft: u('photo-1527960471264-932f39eb5846'),
  beans: u('photo-1442512595331-e89e73853f31'),
  interior: u('photo-1501339847302-ac426a4a7cbb'),
  window: u('photo-1453614512568-c4024d13c247'),
}

export const cafe = {
  name: 'Ahla Al Layali Cafe',
  nameAr: 'أحلى الليالي',
  tagline: 'The best of nights',
  phoneDisplay: '+971 4 575 2298',
  phoneTel: '+97145752298',
  whatsapp: '97145752298',
  addressLines: [
    'Shop 07-12, Building P-28',
    'France Cluster, International City',
    'Dubai, United Arab Emirates',
  ],
  mapQuery: 'Ahla Al Layali Cafe, Shop 07-12, P-28, France Cluster, International City, Dubai',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Ahla+Al+Layali+Cafe+France+Cluster+International+City+Dubai',
  hours: [{ days: 'Every day', time: 'Open 24 hours' }],
  hoursNote: 'Open 24/7. The café does not close.',
  reservationFee: 50,
  privateFee: 100,
  minGuests: 2,
}

export function whatsappLink(text) {
  return `https://wa.me/${cafe.whatsapp}?text=${encodeURIComponent(text)}`
}

export function formatAED(amount) {
  const value = Math.round(Number(amount))
  return `AED ${value}`
}

const categoryCopy = {
  'Night Deals': (name) =>
    `${name}. A Monday–Wednesday lounge deal, available all day. Choose a standard shisha flavor.`,
  Shisha: (name) =>
    `${name}. A full shisha head, served at the table and tended while you stay.`,
  'Hot Drinks': (name) => `${name}, made to order at the coffee bar.`,
  'Iced Coffee': (name) => `${name}, poured over ice.`,
  Frappuccino: (name) => `${name}, blended cold and finished at the bar.`,
  'Fresh Juices': (name) => `${name}, squeezed or blended to order.`,
  Mojito: (name) => `${name}, a café mojito with fresh mint.`,
  Milkshakes: (name) => `${name}, thick and blended.`,
  'Soft Drinks': (name) => `${name}, served cold.`,
  'Café Cocktails': (name) => `${name}, a blended café cocktail.`,
  Breakfast: (name) => `${name}, from the morning kitchen.`,
  Seafood: (name) => `${name}, grilled and stacked to order.`,
  Hawawshi: (name) => `${name}, baked hawawshi from the griddle.`,
  Chicken: (name) => `${name}, cooked to order.`,
  Burgers: (name) => `${name}, served with the house bun.`,
  Plates: (name) => `${name}, a full plate from the kitchen.`,
  'Beef Sandwiches': (name) => `${name}, grilled and served hot.`,
  Crepes: (name) => `${name}, folded to order.`,
  Sweets: (name) => `${name}, from the dessert counter.`,
}

let seq = 0
function add(category, kind, image, rows) {
  return rows.map((row) => {
    const [name, nameAr, price, extra = {}] = row
    seq += 1
    return {
      id: `m${seq}`,
      name,
      nameAr,
      price,
      category,
      kind,
      image: extra.image || image,
      desc: extra.desc || categoryCopy[category](name),
      tags: extra.tags || [],
      sizes: extra.sizes || null,
      popular: Boolean(extra.popular),
      dealWith: extra.dealWith || null,
      homeGroup: extra.homeGroup || null,
    }
  })
}

const standardNote = 'Included with Monday–Wednesday deals when you choose a standard flavor.'

export const menu = [
  ...add('Night Deals', 'deal', images.bar, [
    ['Shisha + Tea', 'شيشة + شاي', 35, { dealWith: 'tea', popular: true, homeGroup: 'Shisha', tags: ['Mon–Wed'], desc: 'One shisha and a pot of tea. Monday to Wednesday, all day.' }],
    ['Shisha + Soft Drink', 'شيشة + مشروب غازي', 35, { dealWith: 'soft', tags: ['Mon–Wed'], desc: 'One shisha and a soft drink. Monday to Wednesday, all day.' }],
    ['Shisha + Turkish Coffee', 'شيشة + قهوة تركية', 35, { dealWith: 'turkish', popular: true, homeGroup: 'Shisha', tags: ['Mon–Wed'], desc: 'One shisha and a Turkish coffee. Monday to Wednesday, all day.' }],
    ['Shisha + Sweet', 'شيشة + حلى', 45, { dealWith: 'sweet', tags: ['Mon–Wed'], desc: 'One shisha and a sweet from the counter. Monday to Wednesday, all day.' }],
    ['Shisha + Fresh Juice', 'شيشة + عصير فريش', 45, { dealWith: 'juice', popular: true, homeGroup: 'Shisha', tags: ['Mon–Wed'], desc: 'One shisha and a fresh juice. Monday to Wednesday, all day.' }],
  ]),
  ...add('Shisha', 'shisha', images.shisha, [
    ['Apple Nakhala', 'تفاح نخلة', 35, { popular: true, homeGroup: 'Shisha', tags: ['Popular'], desc: `Apple Nakhala. ${standardNote}` }],
    ['Apple Fakher', 'تفاح فاخر', 35, { desc: `Apple Fakher. ${standardNote}` }],
    ['Grapes', 'عنب', 35, { desc: `Grapes. ${standardNote}` }],
    ['Grape Mint', 'عنب نعناع', 35, { popular: true, homeGroup: 'Shisha', tags: ['Popular'], desc: `Grape and mint. ${standardNote}` }],
    ['Lemon Mint', 'ليمون نعناع', 35, { popular: true, homeGroup: 'Shisha', tags: ['Popular'], desc: `Lemon and mint. ${standardNote}` }],
    ['Mint Gum', 'علكة نعناع', 35],
    ['Blueberry', 'بلو بيري', 35],
    ['Mint', 'نعناع', 35],
    ['Sweet Melon', 'شمام', 35],
    ['Strawberry', 'فراولة', 35],
    ['Peach', 'خوخ', 35],
    ['Watermelon', 'بطيخ', 35],
    ['Orange', 'برتقال', 35],
    ['Vanilla', 'فانيلا', 35],
    ['Love', 'لاف', 35],
    ['Cocktail', 'كوكتيل', 40, { tags: ['House mix'] }],
    ['Mango', 'مانجو', 35],
    ['Salloum', 'سلوم', 35],
    ['Qass', 'قص', 35],
    ['Apple Mint', 'تفاح نعناع', 35, { popular: true, homeGroup: 'Shisha' }],
    ['Cinnamon Gum', 'علكة قرفة', 35],
    ['Grapes Fruit', 'عنب فواكه', 35],
    ['Ice', 'آيس', 35, { tags: ['Ice base'] }],
    ['Rose', 'ورد', 35],
    ['Mint Qshta', 'قشطة نعناع', 35],
    ['Kiwi', 'كيوي', 35],
    ['Layali Special', 'الليالي خاصة', 65, { popular: true, homeGroup: 'Shisha', tags: ['House'], desc: 'The house special head. A longer, richer session for the table.' }],
    ['Special Ladies Shisha', 'شيشة السيدات المميزة', 55, { tags: ['House'], desc: 'A lighter house blend prepared for a quieter session.' }],
    ['Mix', 'مكس', 40, { tags: ['Two flavors'], desc: 'Two flavors in one head. Name both in the note when you order.' }],
    ['Renew', 'تجديد', 18, { desc: 'A fresh coal and head refresh for the shisha already at your table.' }],
    ['Russian Shisha', 'شيشة روسية', 60, { tags: ['House'], desc: 'Russian-style shisha, prepared as its own session.' }],
    ['Special Shisha', 'شيشة خاصة', 80, { tags: ['Premium'], desc: 'The premium special. Ask the lounge team for today’s blend.' }],
    ['Special Shisha Renew', 'تجديد شيشة خاصة', 30, { desc: 'A refresh for a special shisha already at the table.' }],
  ]),
  ...add('Hot Drinks', 'coffee', images.hot, [
    ['French Coffee', 'قهوة فرنسي', 15],
    ['Tea', 'شاي', 10, { kind: 'tea' }],
    ['Green Tea', 'شاي أخضر', 10, { kind: 'tea' }],
    ['Zohrat', 'زهورات', 10, { kind: 'tea', desc: 'A floral herbal infusion.' }],
    ['Karak', 'كرك', 10, { popular: true, homeGroup: 'Coffee', tags: ['Popular'], desc: 'Cardamom karak, simmered the café way.' }],
    ['Ginger Tea', 'شاي الزنجبيل', 12, { kind: 'tea' }],
    ['Milk Tea', 'شاي بالحليب', 12, { kind: 'tea' }],
    ['Cumin and Lemon', 'كمون وليمون', 15, { kind: 'tea' }],
    ['Mint Tea', 'نعناع', 10, { kind: 'tea' }],
    ['Anise', 'يانسون', 10, { kind: 'tea' }],
    ['Hibiscus', 'كركديه', 10, { kind: 'tea' }],
    ['Ginger', 'زنجبيل', 15, { kind: 'tea' }],
    ['Ginger Honey Lemon', 'زنجبيل عسل ليمون', 15, { kind: 'tea', popular: true, homeGroup: 'Coffee' }],
    ['Chamomile', 'بابونج', 10, { kind: 'tea' }],
    ['Cinnamon with Milk', 'قرفة بالحليب', 15],
    ['Sahlab', 'سحلب', 15, { desc: 'Warm sahlab, finished with cinnamon.' }],
    ['Flat White', 'فلات وايت', 20, { homeGroup: 'Coffee' }],
    ['Espresso con Panna', 'إسبريسو كون بانا', 18],
    ['Cappuccino', 'كابتشينو', 20, { popular: true, homeGroup: 'Coffee' }],
    ['Latte', 'لاتيه', 20, { homeGroup: 'Coffee' }],
    ['Mocha', 'موكا', 20],
    ['Spanish Latte', 'سبانش لاتيه', 22, { popular: true, homeGroup: 'Coffee', tags: ['Popular'] }],
    ['White Mocha', 'وايت موكا', 22],
    ['Hot Chocolate', 'هوت شوكلت', 18, { kind: 'drink' }],
    ['Nescafe with Milk', 'نسكافيه بالحليب', 18],
    ['Nescafe Black', 'نسكافيه بلاك', 13],
    ['Americano', 'أمريكانو', 20],
    ['Lungo', 'لونجو', 20],
    ['Cortado', 'كورتادو', 22],
    ['Caramel Latte', 'كراميل لاتيه', 22, { homeGroup: 'Coffee' }],
    ['Turkish Coffee', 'قهوة تركية', 12, { popular: true, homeGroup: 'Coffee', tags: ['Popular'], sizes: [{ label: 'Single', add: 0 }, { label: 'Double', add: 4 }], desc: 'Authentic Turkish coffee. Single AED 12, double AED 16.' }],
    ['Moroccan Tea', 'شاي مغربي', 18, { kind: 'tea', sizes: [{ label: 'Small', add: 0 }, { label: 'Large', add: 7 }], desc: 'Mint Moroccan tea. Small AED 18, large AED 25.' }],
    ['Espresso', 'إسبريسو', 15, { sizes: [{ label: 'Single', add: 0 }, { label: 'Double', add: 3 }], desc: 'A short espresso. Single AED 15, double AED 18.' }],
    ['Halwa with Milk', 'حلاوة بالحليب', 15],
    ['Chinese Tea Pot', 'شاي صيني إبريق', 35, { kind: 'tea', desc: 'A pot of Chinese tea for the table.' }],
  ]),
  ...add('Iced Coffee', 'coffee', images.iced, [
    ['Ice Latte', 'آيس لاتيه', 25, { homeGroup: 'Coffee' }],
    ['Ice Coffee', 'آيس كوفي', 25],
    ['Ice Mocha', 'آيس موكا', 25],
    ['Ice White Mocha', 'آيس وايت موكا', 25],
    ['Ice Spanish Latte', 'آيس سبانش لاتيه', 25, { popular: true, homeGroup: 'Coffee', tags: ['Popular'] }],
    ['Ice Caramel', 'آيس كراميل', 25],
    ['Ice Americano', 'آيس أمريكانو', 25],
    ['Ice Tea Peach', 'آيس تي خوخ', 20, { kind: 'drink' }],
    ['Ice Blue Latte', 'آيس بلو لاتيه', 28],
    ['Ice Caramel Macchiato', 'كراميل ماكياتو مثلج', 28],
    ['Ice Strawberry Macchiato', 'ماكياتو فراولة مثلج', 28],
    ['Pistachio Ice Latte', 'لاتيه فستق مثلج', 28, { homeGroup: 'Coffee' }],
    ['Strawberry Ice Latte', 'لاتيه فراولة مثلج', 28],
    ['Orange Ice Latte', 'لاتيه برتقال مثلج', 28],
    ['Chocolate Ice Latte', 'لاتيه شوكولاتة مثلج', 28],
    ['Avocado Macchiato', 'أفوكادو ماكياتو', 28],
  ]),
  ...add('Frappuccino', 'coffee', images.frap, [
    ['Caramel Frappuccino', 'فرابوتشينو كراميل', 25],
    ['Frappuccino Mocha', 'فرابوتشينو موكا', 25],
    ['Nutella Frappuccino', 'فرابوتشينو نوتيلا', 25, { popular: true, homeGroup: 'Coffee' }],
    ['Frappuccino Lotus', 'فرابوتشينو لوتس', 25],
    ['Vanilla Frappuccino', 'فرابوتشينو فانيلا', 25],
  ]),
  ...add('Fresh Juices', 'drink', images.juice, [
    ['Mango Juice', 'مانجا', 26, { popular: true, homeGroup: 'Juices', image: images.orange }],
    ['Orange Juice', 'برتقال', 26, { popular: true, homeGroup: 'Juices', image: images.orange }],
    ['Strawberry Juice', 'فراولة', 26, { homeGroup: 'Juices' }],
    ['Pomegranate Juice', 'رمان', 28],
    ['Lemon Juice', 'ليمون', 26],
    ['Lemon and Mint Juice', 'ليمون نعناع', 26, { popular: true, homeGroup: 'Juices' }],
    ['Watermelon Juice', 'بطيخ', 26],
    ['Sweet Melon Juice', 'شمام', 26],
    ['Pineapple Juice', 'أناناس', 26],
    ['Banana with Milk', 'موز بالحليب', 26],
    ['Avocado Juice', 'أفوكادو', 26],
    ['Apple Juice', 'تفاح', 26],
    ['Carrot Juice', 'جزر', 26],
    ['Kiwi Juice', 'كيوي', 26],
    ['Cocktail Juice', 'كوكتيل', 30, { desc: 'A mixed fresh-fruit cocktail juice.' }],
    ['Avocado Honey Nuts', 'أفوكادو عسل ومكسرات', 30, { tags: ['House'] }],
  ]),
  ...add('Mojito', 'drink', images.mojito, [
    ['Lemon and Mint Mojito', 'موهيتو ليمون نعناع', 28, { popular: true, homeGroup: 'Juices' }],
    ['Passion Fruit Mojito', 'موهيتو باشن فروت', 28],
    ['Strawberry Mojito', 'موهيتو فراولة', 28],
    ['Blueberry Mojito', 'موهيتو توت', 28],
    ['Mojito Blue Crush', 'موهيتو بلو كرش', 28],
    ['Mango Mojito', 'موهيتو مانجو', 28],
    ['Watermelon Mojito', 'موهيتو بطيخ', 28],
    ['Peach Mojito', 'موهيتو خوخ', 28],
    ['Pomegranate Mojito', 'موهيتو رمان', 28],
    ['Vimto Mojito', 'موهيتو فيمتو', 25],
    ['Pineapple Mojito', 'موهيتو أناناس', 28],
    ['Red Bull Mojito', 'موهيتو ريد بول', 35],
    ['Blueberry Red Bull Mojito', 'موهيتو توت ريد بول', 35],
    ['Passion Fruit Red Bull Mojito', 'موهيتو باشن ريد بول', 35],
  ]),
  ...add('Milkshakes', 'drink', images.shake, [
    ['Vanilla Milkshake', 'ميلك شيك فانيلا', 30],
    ['Mango Milkshake', 'ميلك شيك مانجو', 30],
    ['Chocolate Milkshake', 'ميلك شيك شوكولاتة', 30, { homeGroup: 'Sweets' }],
    ['Nutella Milkshake', 'ميلك شيك نوتيلا', 30],
    ['Oreo Milkshake', 'ميلك شيك أوريو', 32],
    ['Lotus Milkshake', 'ميلك شيك لوتس', 32],
    ['Strawberry Milkshake', 'ميلك شيك فراولة', 30],
    ['Snickers Milkshake', 'ميلك شيك سنيكرز', 32],
    ['Pistachio Milkshake', 'ميلك شيك فستق', 32],
    ['Banana Milkshake', 'ميلك شيك موز', 30],
    ['Caramel Milkshake', 'ميلك شيك كراميل', 30],
    ['Mocha Milkshake', 'ميلك شيك موكا', 32],
    ['Kinder Milkshake', 'ميلك شيك كيندر', 32],
    ['Al Layali Milkshake', 'ميلك شيك أحلى الليالي', 35, { popular: true, homeGroup: 'Sweets', tags: ['House'] }],
  ]),
  ...add('Soft Drinks', 'soft', images.soft, [
    ['Pepsi', 'بيبسي', 10],
    ['Cola', 'كولا', 10],
    ['7Up', 'سفن أب', 10],
    ['Sprite', 'سبرايت', 10],
    ['Fanta Orange', 'فانتا برتقال', 10],
    ['Apple Fanta', 'فانتا تفاح', 10],
    ['Shani', 'شاني', 10],
    ['Barbican Pineapple', 'باربيكان أناناس', 15],
    ['Barbican Pomegranate', 'باربيكان رمان', 15],
    ['Barbican Apple', 'باربيكان تفاح', 15],
    ['Barbican Strawberry', 'باربيكان فراولة', 15],
    ['Vitamin C', 'فيتامين سي', 15],
    ['Red Bull', 'ريد بول', 20],
    ['Dew', 'ديو', 10],
    ['Power Horse', 'باور هورس', 14],
    ['Sparkling Water', 'مياه غازية', 10],
    ['Diet Pepsi', 'دايت بيبسي', 10],
    ['7Up Diet', 'دايت سفن أب', 10],
    ['7Up + Vimto', 'سفن أب مع فيمتو', 15],
    ['Red Bull + Syrup', 'ريد بول مع سيروب', 22],
    ['Small Water', 'مياه صغيرة', 5],
  ]),
  ...add('Café Cocktails', 'drink', images.cocktail, [
    ['Pina Colada', 'بينا كولادا', 35],
    ['Florida', 'فلوريدا', 35],
    ['Jamaica Cocktail', 'كوكتيل جامايكا', 30],
    ['Al Layali Night Cocktail', 'كوكتيل ليلة الليالي', 35, { popular: true, homeGroup: 'Juices', tags: ['House'], desc: 'The house night cocktail, blended for the lounge.' }],
  ]),
  ...add('Breakfast', 'food', images.breakfast, [
    ['Arabic Breakfast', 'فطور عربي', 22, { popular: true, homeGroup: 'Kitchen', tags: ['Popular'], desc: 'The Arabic breakfast plate: eggs, beans, and the morning spread.' }],
    ['Shakshuka Plate', 'شكشوكة', 12, { homeGroup: 'Kitchen', desc: 'Eggs baked in a spiced tomato pan.' }],
    ['Cheese Toast', 'توست جبنة', 8, { desc: 'Toast with creamy, feta, or roumy cheese.' }],
    ['Egg Cheese Toast', 'توست بيض جبنة', 10],
    ['Halloumi Cheese Toast', 'توست حلومي', 9, { homeGroup: 'Kitchen' }],
    ['Labneh Toast', 'توست لبنة', 8, { desc: 'Labneh toast with olives and thyme.' }],
    ['Vegetable Toast', 'توست خضار', 8],
    ['Club Sandwich', 'كلوب ساندوتش', 15, { image: images.sandwich }],
    ['Sandwich with Fries', 'ساندوتش مع بطاطس', 6, { image: images.fries }],
    ['Cheddar Fries Sandwich', 'بطاطس مع جبنة', 8, { image: images.fries }],
    ['Halloumi Sandwich', 'ساندوتش حلومي', 7, { image: images.sandwich }],
  ]),
  ...add('Seafood', 'food', images.sandwich, [
    ['Shrimp Sandwich', 'ساندوتش جمبري', 18],
    ['Shrimp Fajita Sandwich', 'ساندوتش فاهيتا جمبري', 20, { popular: true, homeGroup: 'Kitchen' }],
  ]),
  ...add('Hawawshi', 'food', images.chicken, [
    ['Hawawshi Meat', 'حواوشي لحم', 18],
    ['Hawawshi Meat & Cheese', 'حواوشي لحم وجبنة', 20],
    ['Hawawshi Sausage', 'حواوشي سجق', 15],
    ['Hawawshi Sausage & Cheese', 'حواوشي سجق وجبنة', 17],
    ['Hawawshi Best Night', 'حواوشي أحلى الليالي', 23, { popular: true, homeGroup: 'Kitchen', tags: ['House'], desc: 'The house hawawshi, baked the way the night crowd orders it.' }],
  ]),
  ...add('Chicken', 'food', images.chicken, [
    ['Chicken Fajita', 'فاهيتا دجاج', 15, { homeGroup: 'Kitchen' }],
    ['Super Supreme Chicken', 'دجاج سوبر سوبريم', 16],
    ['Shish Tawook', 'شيش طاووق', 15, { popular: true, homeGroup: 'Kitchen' }],
    ['Crispy Chicken', 'دجاج مقرمش', 13],
    ['Zinger Chicken', 'دجاج زنجر', 15],
    ['Cordon Bleu', 'كوردون بلو', 15],
  ]),
  ...add('Burgers', 'food', images.burger, [
    ['Chicken Burger', 'برجر دجاج', 11],
    ['BBQ Burger', 'برجر باربيكيو', 18],
    ['Meat Burger', 'برجر لحم', 14],
    ['Egg Burger', 'برجر بيض', 16],
    ['Mushroom Burger', 'برجر مشروم', 16],
    ['Cheddar Burger', 'برجر شيدر', 13],
    ['Double Burger', 'دبل برجر', 17],
    ['Al Layali Burger', 'برجر أحلى الليالي', 20, { popular: true, homeGroup: 'Kitchen', tags: ['House'], desc: 'The house burger, stacked for a late meal.' }],
  ]),
  ...add('Plates', 'food', images.fries, [
    ['French Fries', 'بطاطس مقلية', 10],
    ['Cheddar Fries', 'بطاطس بالجبن', 13, { image: images.fries }],
    ['Crispy Chicken Plate', 'صحن دجاج كرسبي', 18, { image: images.chicken }],
    ['Zinger Chicken Plate', 'صحن زنجر', 18, { image: images.chicken }],
    ['Cordon Bleu Plate', 'صحن كوردون بلو', 20, { image: images.chicken }],
    ['Fried Chicken Plate', 'دجاج مقلي', 20, { image: images.chicken, desc: 'A plate of fried chicken from the kitchen.' }],
  ]),
  ...add('Beef Sandwiches', 'food', images.sandwich, [
    ['Beef Fajita', 'فاهيتا لحم', 18],
    ['Philadelphia', 'فيلادلفيا', 20, { popular: true, homeGroup: 'Kitchen' }],
    ['Beef Fillet', 'فيليه', 18],
    ['Meat Kofta', 'كفتة لحم', 16],
    ['Grilled Sausage', 'سجق مشوي', 15],
    ['Mexican Sausage', 'سجق مكسيكي', 16],
    ['Mexican Hotdog', 'هوت دوغ مكسيكي', 15],
  ]),
  ...add('Crepes', 'dessert', images.crepe, [
    ['Nutella Crepe', 'كريب نوتيلا', 29, { homeGroup: 'Sweets' }],
    ['Lotus Crepe', 'كريب لوتس', 29],
    ['Fruit Crepe', 'كريب فواكه', 34],
    ['Cream Crepe', 'كريب كريمة', 34],
    ['Ice Cream Crepe', 'كريب آيس كريم', 34],
    ['Pistachio Crepe', 'كريب فستق', 34],
    ['Marshmallow Crepe', 'كريب مارشميلو', 29],
    ['Kinder Crepe', 'كريب كيندر', 29],
    ['Banana Crepe', 'كريب موز', 29],
    ['Strawberry Crepe', 'كريب فراولة', 29],
    ['Al Layali Crepe', 'كريب الليالي', 39, { popular: true, homeGroup: 'Sweets', tags: ['House'], desc: 'The house crepe, finished the way the café serves it after midnight.' }],
  ]),
  ...add('Sweets', 'dessert', images.sweet, [
    ['Rice Milk', 'حليب الأرز', 15],
    ['Rice Milk with Nuts', 'حليب الأرز بالمكسرات', 20],
    ['Rice Milk with Fruit', 'حليب الأرز بالفواكه', 20],
    ['Cheesecake', 'تشيز كيك', 15, { image: images.sweet }],
    ['Strawberry Cheesecake', 'تشيز كيك فراولة', 15],
    ['Nutella Cheesecake', 'تشيز كيك نوتيلا', 15],
    ['Pistachio Cheesecake', 'تشيز كيك فستق', 15, { popular: true, homeGroup: 'Sweets', tags: ['House'] }],
  ]),
]

const kindOverrides = new Map([
  ['Tea', 'tea'],
  ['Green Tea', 'tea'],
  ['Zohrat', 'tea'],
  ['Ginger Tea', 'tea'],
  ['Milk Tea', 'tea'],
  ['Cumin and Lemon', 'tea'],
  ['Mint Tea', 'tea'],
  ['Anise', 'tea'],
  ['Hibiscus', 'tea'],
  ['Ginger', 'tea'],
  ['Ginger Honey Lemon', 'tea'],
  ['Chamomile', 'tea'],
  ['Moroccan Tea', 'tea'],
  ['Chinese Tea Pot', 'tea'],
  ['Hot Chocolate', 'drink'],
  ['Ice Tea Peach', 'drink'],
])

menu.forEach((item) => {
  if (kindOverrides.has(item.name)) item.kind = kindOverrides.get(item.name)
})

const boardOf = {
  Breakfast: 'Food',
  Seafood: 'Food',
  Hawawshi: 'Food',
  Chicken: 'Food',
  Burgers: 'Food',
  Plates: 'Food',
  'Beef Sandwiches': 'Food',
  Crepes: 'Food',
  Sweets: 'Food',
  'Fresh Juices': 'Drinks',
  Mojito: 'Drinks',
  Milkshakes: 'Drinks',
  'Soft Drinks': 'Drinks',
  'Café Cocktails': 'Drinks',
  'Hot Drinks': 'Coffee',
  'Iced Coffee': 'Coffee',
  Frappuccino: 'Coffee',
  Shisha: 'Shisha',
}

menu.forEach((item) => {
  item.board = boardOf[item.category] || null
})

export const boards = [
  {
    id: 'Food',
    label: 'Food',
    blurb: 'Breakfast, sandwiches, plates, crepes, and sweets. Order any dish on its own.',
  },
  {
    id: 'Drinks',
    label: 'Drinks',
    blurb: 'Fresh juice, mojitos, milkshakes, and cold drinks. No shisha and no coffee required.',
  },
  {
    id: 'Coffee',
    label: 'Coffee',
    blurb: 'Turkish coffee, espresso, tea, and iced coffee. Order a cup without a table package.',
  },
  {
    id: 'Shisha',
    label: 'Shisha',
    blurb: 'Every flavor at its own price. A shisha does not have to come with food or coffee.',
  },
]

export const aLaCarte = menu.filter((item) => item.board)

function sectionName(item) {
  if (item.category === 'Hot Drinks') return item.kind === 'tea' ? 'Tea' : 'Coffee'
  if (item.category === 'Shisha') return 'Flavors'
  return item.category
}

export function sectionsFor(boardId, query = '') {
  const needle = query.trim().toLowerCase()
  const items = aLaCarte.filter((item) => {
    if (item.board !== boardId) return false
    if (!needle) return true
    return item.name.toLowerCase().includes(needle) || item.nameAr.includes(query.trim()) || sectionName(item).toLowerCase().includes(needle)
  })
  const names = []
  items.forEach((item) => {
    const name = sectionName(item)
    if (!names.includes(name)) names.push(name)
  })
  return names.map((name) => ({ name, items: items.filter((item) => sectionName(item) === name) }))
}

export function priceLabel(item) {
  if (!item.sizes?.length) return formatAED(item.price)
  const top = item.price + Math.max(...item.sizes.map((size) => size.add))
  return `${formatAED(item.price)} / ${formatAED(top)}`
}

const isCoffee = (item) => item.board === 'Coffee' && item.kind === 'coffee'
const isCake = (item) => item.category === 'Sweets' && /cheesecake/i.test(item.name)
const isShishaFlavor = (item) => item.board === 'Shisha' && !/renew/i.test(item.name)
const isWater = (item) => item.name === 'Small Water' || item.name === 'Sparkling Water'
const isFries = (item) => item.name === 'French Fries' || item.name === 'Cheddar Fries'
const isLightSoft = (item) => item.category === 'Soft Drinks' && item.price <= 15

export const offers = [
  {
    id: 'pkg-night',
    mode: 'sum',
    kicker: 'A full table',
    title: 'Shisha, coffee, water & cake',
    text: 'Pick each part. The price is the sum of those menu prices, and any of them can be ordered alone below.',
    image: images.bar,
    slots: [
      { key: 'shisha', title: 'Shisha', match: isShishaFlavor },
      { key: 'coffee', title: 'Coffee', match: isCoffee },
      { key: 'water', title: 'Water', match: isWater },
      { key: 'cake', title: 'Cake', match: isCake },
    ],
  },
  {
    id: 'deal-turkish',
    mode: 'deal',
    itemName: 'Shisha + Turkish Coffee',
    kicker: 'Monday – Wednesday',
    title: 'Shisha + Turkish coffee',
    text: 'One standard shisha and a Turkish coffee, at the café’s deal price.',
    price: 35,
    image: images.turkish,
  },
  {
    id: 'deal-tea',
    mode: 'deal',
    itemName: 'Shisha + Tea',
    kicker: 'Monday – Wednesday',
    title: 'Shisha + tea',
    text: 'One standard shisha and a pot of tea.',
    price: 35,
    image: images.hot,
  },
  {
    id: 'deal-soft',
    mode: 'deal',
    itemName: 'Shisha + Soft Drink',
    kicker: 'Monday – Wednesday',
    title: 'Shisha + soft drink',
    text: 'One standard shisha and a soft drink.',
    price: 35,
    image: images.soft,
  },
  {
    id: 'deal-juice',
    mode: 'deal',
    itemName: 'Shisha + Fresh Juice',
    kicker: 'Monday – Wednesday',
    title: 'Shisha + fresh juice',
    text: 'One standard shisha and a fresh juice.',
    price: 45,
    image: images.juice,
  },
  {
    id: 'deal-sweet',
    mode: 'deal',
    itemName: 'Shisha + Sweet',
    kicker: 'Monday – Wednesday',
    title: 'Shisha + a sweet',
    text: 'One standard shisha and a sweet from the counter.',
    price: 45,
    image: images.sweet,
  },
  {
    id: 'pkg-coffee-cake',
    mode: 'sum',
    kicker: 'No shisha',
    title: 'Coffee and cake',
    text: 'A coffee stop. Choose the cup and the cheesecake. Nothing else is added.',
    image: images.latte,
    slots: [
      { key: 'coffee', title: 'Coffee', match: isCoffee },
      { key: 'cake', title: 'Cake', match: isCake },
    ],
  },
  {
    id: 'pkg-burger',
    mode: 'sum',
    kicker: 'No shisha, no coffee',
    title: 'Burger, fries & a drink',
    text: 'A kitchen order on its own. The price is the burger, the fries, and the drink you pick.',
    image: images.burger,
    slots: [
      { key: 'burger', title: 'Burger', match: (item) => item.category === 'Burgers' },
      { key: 'fries', title: 'Fries', match: isFries },
      { key: 'drink', title: 'Drink', match: isLightSoft },
    ],
  },
]

export function slotOptions(slot) {
  return aLaCarte.filter(slot.match).sort((a, b) => a.price - b.price || a.name.localeCompare(b.name))
}

export function offerFromPrice(offer) {
  if (offer.price) return offer.price
  return offer.slots.reduce((sum, slot) => sum + (slotOptions(slot)[0]?.price || 0), 0)
}

export const categories = [...new Set(menu.map((item) => item.category))]

export const homeFilters = ['All', 'Shisha', 'Coffee', 'Juices', 'Kitchen', 'Sweets']

const homeLineup = [
  'Grape Mint',
  'Layali Special',
  'Turkish Coffee',
  'Spanish Latte',
  'Arabic Breakfast',
  'Al Layali Burger',
  'Mango Juice',
  'Al Layali Crepe',
  'Shisha + Turkish Coffee',
]

export function featuredItems(filter = 'All') {
  if (filter === 'All') {
    return homeLineup.map((name) => menu.find((item) => item.name === name)).filter(Boolean)
  }
  return menu.filter((item) => item.popular && item.homeGroup === filter).slice(0, 8)
}

const preference = (key, title, labels) => ({
  key,
  title,
  choices: labels.map((label) => ({ id: label, label, add: 0 })),
})

export function optionGroupsFor(item) {
  const groups = []
  if (item.sizes?.length) {
    groups.push({
      key: 'size',
      title: 'Size',
      choices: item.sizes.map((size) => ({ id: size.label, label: size.label, add: size.add })),
    })
  }
  if (item.kind === 'deal') {
    const flavors = menu.filter((entry) => entry.category === 'Shisha' && entry.price === 35)
    groups.push({
      key: 'flavor',
      title: 'Standard shisha flavor',
      choices: flavors.map((flavor) => ({ id: flavor.id, label: flavor.name, add: 0 })),
    })
    if (item.dealWith === 'sweet') {
      groups.push({
        key: 'side',
        title: 'Sweet',
        choices: menu
          .filter((entry) => entry.category === 'Sweets')
          .map((sweet) => ({ id: sweet.id, label: sweet.name, add: 0 })),
      })
    }
    if (item.dealWith === 'juice') {
      groups.push({
        key: 'side',
        title: 'Fresh juice',
        choices: menu
          .filter((entry) => entry.category === 'Fresh Juices')
          .map((juice) => ({ id: juice.id, label: juice.name, add: 0 })),
      })
    }
    if (item.dealWith === 'soft') {
      groups.push({
        key: 'side',
        title: 'Soft drink',
        choices: menu
          .filter((entry) => entry.category === 'Soft Drinks' && entry.price <= 15)
          .map((drink) => ({ id: drink.id, label: drink.name, add: 0 })),
      })
    }
  }
  if (item.kind === 'coffee') {
    groups.push(preference('milk', 'Milk', ['Regular', 'Low fat', 'Oat', 'Almond']))
    groups.push(preference('sweetness', 'Sugar', ['None', 'Less', 'Regular', 'Extra']))
  }
  if (item.kind === 'tea') {
    groups.push(preference('sweetness', 'Sugar', ['None', 'Less', 'Regular', 'Extra']))
  }
  if (item.kind === 'drink') {
    groups.push(preference('sweetness', 'Sweetness', ['Less', 'Regular', 'Extra']))
    groups.push(preference('ice', 'Ice', ['Normal', 'Light', 'No ice']))
  }
  if (item.kind === 'food') {
    groups.push(preference('spice', 'Spice', ['Mild', 'Regular', 'Hot']))
  }
  if (item.kind === 'shisha') {
    groups.push(preference('setup', 'Setup', ['Standard head', 'Extra mint on top']))
  }
  return groups
}

export function unitPrice(item, groups, choices) {
  return groups.reduce((sum, group) => {
    const selected = group.choices.find((choice) => choice.id === choices[group.key])
    return sum + (selected?.add || 0)
  }, item.price)
}

export function choiceSummary(groups, choices) {
  return groups
    .map((group) => group.choices.find((choice) => choice.id === choices[group.key]))
    .filter((choice) => choice && choice.add >= 0)
    .map((choice) => choice.label)
}

export const gallery = [
  { src: images.pour, caption: 'Espresso pulled at the bar', cat: 'Coffee' },
  { src: images.latte, caption: 'Latte art in a wide cup', cat: 'Coffee' },
  { src: images.iced, caption: 'Iced coffee for the late table', cat: 'Coffee' },
  { src: images.turkish, caption: 'Turkish coffee, brewed short and strong', cat: 'Coffee' },
  { src: images.juice, caption: 'Fresh juice, blended to order', cat: 'Drinks' },
  { src: images.mojito, caption: 'Mint mojito on a warm night', cat: 'Drinks' },
  { src: images.cocktail, caption: 'Café cocktails at the lounge', cat: 'Drinks' },
  { src: images.burger, caption: 'The house burger', cat: 'Kitchen' },
  { src: images.breakfast, caption: 'Breakfast before the city fills up', cat: 'Kitchen' },
  { src: images.crepe, caption: 'Crepes from the sweet counter', cat: 'Kitchen' },
  { src: images.sweet, caption: 'Cheesecake to close the night', cat: 'Kitchen' },
  { src: images.about, caption: 'A quiet corner in the café', cat: 'Lounge' },
  { src: images.lounge, caption: 'Tables set for a long sitting', cat: 'Lounge' },
  { src: images.night, caption: 'The room after dark', cat: 'Lounge' },
  { src: images.bar, caption: 'The lounge bar, ready for shisha service', cat: 'Shisha' },
  { src: images.dark, caption: 'Low light and a table that is yours for the night', cat: 'Shisha' },
]

export const seedReviews = [
  {
    id: 'r1',
    name: 'Noura A.',
    detail: 'France Cluster regular',
    stars: 5,
    text: 'Grape mint lasted the whole evening, and the team changed the coals without making a fuss. Easy place to actually talk.',
  },
  {
    id: 'r2',
    name: 'Hassan K.',
    detail: 'Breakfast guest',
    stars: 5,
    text: 'Arabic breakfast and a mango juice before work. The prices make sense for International City, and the room is calm in the morning.',
  },
  {
    id: 'r3',
    name: 'Layla M.',
    detail: 'Family table',
    stars: 4,
    text: 'We booked a family table on Friday. The Al Layali burger and karak arrived hot, and nobody rushed us out.',
  },
  {
    id: 'r4',
    name: 'Omar S.',
    detail: 'Late lounge',
    stars: 5,
    text: 'Turkish coffee with apple nakhala. Comfortable seats, fair bill, and a night that did not feel hurried.',
  },
]

export const promises = [
  {
    title: 'Open 24/7',
    text: 'The doors never close, so breakfast and the last sitting live in the same room.',
  },
  {
    title: 'Shisha tended at the table',
    text: 'A full flavor list, from apple and grape mint to the house special, with coals looked after while you stay.',
  },
  {
    title: 'Coffee and a real kitchen',
    text: 'Turkish coffee, karak, fresh juice, breakfast, burgers, hawawshi, and sweets — not just a drink menu.',
  },
  {
    title: 'Tables you can book',
    text: 'A regular table in the open lounge, or a separated private cubicle. The cubicle booking is AED 100, then you pay for what you order.',
  },
]

export const areas = [
  {
    id: 'open',
    label: 'Open area',
    note: 'A regular table in the lounge.',
    fee: 50,
    unit: 'table',
    units: 'tables',
  },
  {
    id: 'private',
    label: 'Private cubicle',
    note: 'Separated private cubicle. You pay for what you order on top.',
    fee: 100,
    unit: 'cubicle',
    units: 'cubicles',
  },
]

export const seating = [
  { id: 'lounge', label: 'Lounge', note: 'Low tables for a shisha sitting' },
  { id: 'family', label: 'Family', note: 'A larger table, away from the bar' },
  { id: 'couples', label: 'Couples corner', note: 'A quieter two-seat table' },
  { id: 'group', label: 'Friends', note: 'Four or more, one shared table' },
  { id: 'any', label: 'No preference', note: 'Seat us wherever is free' },
]

export const occasions = ['Just sitting', 'Friends night', 'Family meal', 'Birthday', 'Match night']

export function timeSlots() {
  const slots = []
  for (let hour = 6; hour < 24; hour += 1) slots.push(labelTime(hour, 0), labelTime(hour, 30))
  for (let hour = 0; hour <= 5; hour += 1) {
    slots.push(labelTime(hour, 0))
    if (hour < 5) slots.push(labelTime(hour, 30))
  }
  return slots
}

function labelTime(hour, minute) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  const mm = minute === 0 ? '00' : '30'
  return `${h12}:${mm} ${suffix}`
}

export const promos = {
  LAYALI10: { type: 'percent', value: 10, label: '10% off' },
  NIGHTS: { type: 'amount', value: 5, label: 'AED 5 off' },
}
