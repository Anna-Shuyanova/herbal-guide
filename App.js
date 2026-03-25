import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, FlatList, Image, Vibration, StatusBar,
  Animated, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// ========== 18+ ЛЕКАРСТВЕННЫХ ТРАВ ==========
const herbsDatabase = [
  {
    id: 1,
    name: 'Ромашка аптечная',
    latinName: 'Matricaria chamomilla',
    imageUrl: 'https://images.unsplash.com/photo-1580748089189-8b8257b9f2e5?w=400',
    description: 'Ромашка обладает противовоспалительным, успокаивающим и антисептическим действием. Содержит хамазулен, который придает ей противовоспалительные свойства.',
    symptoms: ['Стресс', 'Бессонница', 'Воспаление', 'Головная боль', 'Боль в животе', 'Тревожность'],
    uses: 'Применяется при нервных расстройствах, бессоннице, воспалительных заболеваниях ЖКТ, кожных воспалениях, простудных заболеваниях.',
    preparation: 'Заварить 1 столовую ложку цветков на стакан кипятка. Настоять 10-15 минут, процедить. Принимать 2-3 раза в день.',
    contraindications: 'Беременность (особенно первый триместр), индивидуальная непереносимость.',
    benefits: 'Успокаивает нервную систему, снимает спазмы, борется с воспалениями, улучшает сон.',
    color: '#FFE5B4',
    rating: 4.9,
    reviews: 1247,
    imagePlaceholder: '🌼'
  },
  {
    id: 2,
    name: 'Мелисса лекарственная',
    latinName: 'Melissa officinalis',
    imageUrl: 'https://images.unsplash.com/photo-1616683693504-3f7e9ad5f5b5?w=400',
    description: 'Мелисса успокаивает нервную систему, улучшает сон, помогает при тревожности. Обладает легким спазмолитическим и противовирусным эффектом.',
    symptoms: ['Стресс', 'Тревожность', 'Бессонница', 'Нервное напряжение', 'Головная боль'],
    uses: 'Применяется при нервных расстройствах, бессоннице, депрессивных состояниях, вегето-сосудистой дистонии.',
    preparation: 'Заварить 2 чайные ложки листьев на стакан кипятка. Настоять 10-15 минут. Пить перед сном или при стрессе.',
    contraindications: 'Пониженное давление, индивидуальная непереносимость, беременность.',
    benefits: 'Снимает тревожность, улучшает сон, поднимает настроение, укрепляет нервную систему.',
    color: '#D4E8D4',
    rating: 4.8,
    reviews: 892,
    imagePlaceholder: '🌿'
  },
  {
    id: 3,
    name: 'Имбирь',
    latinName: 'Zingiber officinale',
    imageUrl: 'https://images.unsplash.com/photo-1615484477770-5d4e5d6a9a3a?w=400',
    description: 'Имбирь — мощное природное средство для укрепления иммунитета. Обладает согревающим, противовоспалительным, противовирусным действием.',
    symptoms: ['Простуда', 'Кашель', 'Озноб', 'Тошнота', 'Боль в горле', 'Слабость'],
    uses: 'Применяется при простудных заболеваниях, тошноте, для укрепления иммунитета, улучшения пищеварения, при болях в суставах.',
    preparation: 'Натереть свежий корень имбиря (2-3 см), залить кипятком, добавить мед и лимон. Настоять 5-7 минут.',
    contraindications: 'Язва желудка, желчекаменная болезнь, повышенная температура, последний триместр беременности.',
    benefits: 'Укрепляет иммунитет, согревает, снимает тошноту, борется с вирусами.',
    color: '#F5DEB3',
    rating: 4.9,
    reviews: 2156,
    imagePlaceholder: '🫚'
  },
  {
    id: 4,
    name: 'Мята перечная',
    latinName: 'Mentha piperita',
    imageUrl: 'https://images.unsplash.com/photo-1628557042016-d6c6b9bf8e4b?w=400',
    description: 'Мята обладает спазмолитическим, успокаивающим, обезболивающим и освежающим действием. Содержит ментол.',
    symptoms: ['Головная боль', 'Тошнота', 'Боль в животе', 'Вздутие', 'Стресс', 'Спазмы'],
    uses: 'Применяется при головной боли, спазмах желудка, тошноте, метеоризме, нервном возбуждении, для улучшения аппетита.',
    preparation: 'Заварить 1 столовую ложку листьев на стакан кипятка. Настоять 10-15 минут. Пить после еды.',
    contraindications: 'Варикоз, пониженное давление, беременность, грудное вскармливание.',
    benefits: 'Снимает головную боль, улучшает пищеварение, освежает дыхание, успокаивает.',
    color: '#C8E6C9',
    rating: 4.7,
    reviews: 1456,
    imagePlaceholder: '🌱'
  },
  {
    id: 5,
    name: 'Лаванда',
    latinName: 'Lavandula angustifolia',
    imageUrl: 'https://images.unsplash.com/photo-1616683693504-3f7e9ad5f5b5?w=400',
    description: 'Лаванда — природный антидепрессант. Обладает успокаивающим, расслабляющим, антисептическим действием.',
    symptoms: ['Стресс', 'Бессонница', 'Тревожность', 'Головная боль', 'Нервное напряжение'],
    uses: 'Применяется для ароматерапии, при бессоннице, нервном напряжении, головной боли, для улучшения настроения.',
    preparation: 'Для ванн: 5-7 капель эфирного масла. Для чая: 1 чайную ложку цветков на стакан кипятка.',
    contraindications: 'Беременность, пониженное давление, индивидуальная непереносимость.',
    benefits: 'Снимает стресс, улучшает сон, расслабляет, поднимает настроение.',
    color: '#E6E6FA',
    rating: 4.9,
    reviews: 2341,
    imagePlaceholder: '💜'
  },
  {
    id: 6,
    name: 'Календула',
    latinName: 'Calendula officinalis',
    imageUrl: 'https://images.unsplash.com/photo-1580748089189-8b8257b9f2e5?w=400',
    description: 'Календула обладает мощным противовоспалительным, ранозаживляющим, антисептическим действием.',
    symptoms: ['Воспаление', 'Рана', 'Раздражение', 'Ожог', 'Боль в горле'],
    uses: 'Применяется наружно при воспалениях кожи, порезах, ожогах, угревой сыпи, для полоскания горла.',
    preparation: 'Заварить 1 столовую ложку цветков на стакан кипятка. Использовать для компрессов, примочек или полосканий.',
    contraindications: 'Беременность, пониженное давление, индивидуальная непереносимость.',
    benefits: 'Заживляет раны, снимает воспаление, борется с бактериями, успокаивает кожу.',
    color: '#FFE0B2',
    rating: 4.8,
    reviews: 978,
    imagePlaceholder: '🌼'
  },
  {
    id: 7,
    name: 'Шалфей',
    latinName: 'Salvia officinalis',
    imageUrl: 'https://images.unsplash.com/photo-1628557042016-d6c6b9bf8e4b?w=400',
    description: 'Шалфей обладает антибактериальным, противовоспалительным, вяжущим и антисептическим действием.',
    symptoms: ['Боль в горле', 'Кашель', 'Воспаление десен', 'Воспаление', 'Потливость'],
    uses: 'Применяется для полоскания горла и рта при воспалительных процессах, при кашле, для уменьшения потливости.',
    preparation: 'Заварить 1 столовую ложку листьев на стакан кипятка. Настоять 15 минут. Полоскать 2-3 раза в день.',
    contraindications: 'Беременность, кормление грудью, эпилепсия, заболевания почек.',
    benefits: 'Снимает боль в горле, борется с бактериями, укрепляет десны, помогает при кашле.',
    color: '#DCEDC8',
    rating: 4.7,
    reviews: 654,
    imagePlaceholder: '🍃'
  },
  {
    id: 8,
    name: 'Зверобой',
    latinName: 'Hypericum perforatum',
    imageUrl: 'https://images.unsplash.com/photo-1580748089189-8b8257b9f2e5?w=400',
    description: 'Зверобой обладает антидепрессивным, противовоспалительным, антибактериальным и ранозаживляющим действием.',
    symptoms: ['Стресс', 'Депрессия', 'Тревожность', 'Воспаление', 'Рана'],
    uses: 'Применяется при депрессивных состояниях, нервном истощении, для улучшения настроения, при кожных заболеваниях.',
    preparation: 'Заварить 1 столовую ложку травы на стакан кипятка. Настоять 15 минут. Принимать 1-2 раза в день.',
    contraindications: 'Беременность, кормление грудью, повышенная чувствительность к солнцу.',
    benefits: 'Поднимает настроение, снимает тревожность, заживляет раны, борется с воспалением.',
    color: '#FFF9C4',
    rating: 4.6,
    reviews: 2345,
    imagePlaceholder: '🌻'
  },
  {
    id: 9,
    name: 'Липа',
    latinName: 'Tilia cordata',
    imageUrl: 'https://images.unsplash.com/photo-1628557042016-d6c6b9bf8e4b?w=400',
    description: 'Липа обладает жаропонижающим, противовоспалительным, потогонным и успокаивающим действием.',
    symptoms: ['Простуда', 'Кашель', 'Озноб', 'Головная боль', 'Стресс'],
    uses: 'Применяется при простудных заболеваниях, гриппе, для снижения температуры, при головной боли, нервном напряжении.',
    preparation: 'Заварить 1 столовую ложку цветков липы на стакан кипятка. Настоять 15 минут. Пить с медом.',
    contraindications: 'Индивидуальная непереносимость, сердечные заболевания.',
    benefits: 'Снижает температуру, помогает при простуде, успокаивает, улучшает сон.',
    color: '#FFF3E0',
    rating: 4.8,
    reviews: 876,
    imagePlaceholder: '🌳'
  },
  {
    id: 10,
    name: 'Крапива',
    latinName: 'Urtica dioica',
    imageUrl: 'https://images.unsplash.com/photo-1580748089189-8b8257b9f2e5?w=400',
    description: 'Крапива — мощное кровоостанавливающее и общеукрепляющее средство. Богата витаминами и микроэлементами.',
    symptoms: ['Слабость', 'Анемия', 'Кровотечение', 'Воспаление', 'Выпадение волос'],
    uses: 'Применяется при анемии, для укрепления волос, при кровотечениях, для улучшения обмена веществ.',
    preparation: 'Заварить 1 столовую ложку листьев на стакан кипятка. Настоять 15 минут. Принимать 2 раза в день.',
    contraindications: 'Повышенная свертываемость крови, беременность, заболевания почек.',
    benefits: 'Укрепляет организм, улучшает состав крови, укрепляет волосы, восполняет витамины.',
    color: '#C8E6C9',
    rating: 4.7,
    reviews: 1123,
    imagePlaceholder: '🌿'
  },
  {
    id: 11,
    name: 'Чабрец',
    latinName: 'Thymus serpyllum',
    imageUrl: 'https://images.unsplash.com/photo-1616683693504-3f7e9ad5f5b5?w=400',
    description: 'Чабрец обладает отхаркивающим, противовоспалительным, антисептическим и успокаивающим действием.',
    symptoms: ['Кашель', 'Простуда', 'Боль в горле', 'Стресс', 'Бессонница'],
    uses: 'Применяется при кашле, бронхите, заболеваниях горла, для улучшения пищеварения, при нервном возбуждении.',
    preparation: 'Заварить 1 столовую ложку травы на стакан кипятка. Настоять 15 минут. Пить с медом.',
    contraindications: 'Беременность, заболевания печени, сердечная недостаточность.',
    benefits: 'Помогает при кашле, успокаивает, улучшает пищеварение, борется с бактериями.',
    color: '#E1BEE7',
    rating: 4.8,
    reviews: 1432,
    imagePlaceholder: '🌸'
  },
  {
    id: 12,
    name: 'Валериана',
    latinName: 'Valeriana officinalis',
    imageUrl: 'https://images.unsplash.com/photo-1628557042016-d6c6b9bf8e4b?w=400',
    description: 'Валериана — классическое успокаивающее средство. Обладает седативным, спазмолитическим и снотворным действием.',
    symptoms: ['Стресс', 'Бессонница', 'Тревожность', 'Нервное напряжение', 'Сердцебиение'],
    uses: 'Применяется при бессоннице, нервном возбуждении, вегето-сосудистой дистонии, спазмах ЖКТ.',
    preparation: 'Заварить 1 столовую ложку корня на стакан холодной воды, довести до кипения, томить 15 минут.',
    contraindications: 'Беременность, кормление грудью, депрессия, дети до 3 лет.',
    benefits: 'Успокаивает нервную систему, улучшает сон, снимает спазмы, снижает тревожность.',
    color: '#D7CCC8',
    rating: 4.7,
    reviews: 1987,
    imagePlaceholder: '🌱'
  },
  {
    id: 13,
    name: 'Пустырник',
    latinName: 'Leonurus cardiaca',
    imageUrl: 'https://images.unsplash.com/photo-1580748089189-8b8257b9f2e5?w=400',
    description: 'Пустырник — эффективное сердечно-сосудистое средство. Обладает успокаивающим, гипотензивным и кардиотоническим действием.',
    symptoms: ['Стресс', 'Тревожность', 'Учащенное сердцебиение', 'Гипертония', 'Бессонница'],
    uses: 'Применяется при сердечно-сосудистых неврозах, гипертонии, тахикардии, нервном возбуждении.',
    preparation: 'Заварить 1 столовую ложку травы на стакан кипятка. Настоять 30 минут. Принимать по 1/3 стакана 2-3 раза в день.',
    contraindications: 'Беременность, кормление грудью, пониженное давление, брадикардия.',
    benefits: 'Нормализует сердечный ритм, снижает давление, успокаивает, помогает при стрессе.',
    color: '#E0F2F1',
    rating: 4.8,
    reviews: 876,
    imagePlaceholder: '🌿'
  },
  {
    id: 14,
    name: 'Боярышник',
    latinName: 'Crataegus sanguinea',
    imageUrl: 'https://images.unsplash.com/photo-1616683693504-3f7e9ad5f5b5?w=400',
    description: 'Боярышник — кардиотоническое средство. Улучшает коронарное кровообращение, нормализует сердечный ритм, снижает давление.',
    symptoms: ['Сердцебиение', 'Гипертония', 'Слабость', 'Головокружение', 'Аритмия'],
    uses: 'Применяется при функциональных нарушениях сердечной деятельности, стенокардии, гипертонии, аритмии.',
    preparation: 'Заварить 1 столовую ложку плодов на стакан кипятка. Настоять 2 часа в термосе. Принимать по 1/3 стакана 3 раза в день.',
    contraindications: 'Беременность, кормление грудью, гипотония, брадикардия.',
    benefits: 'Укрепляет сердце, нормализует ритм, снижает давление, улучшает кровообращение.',
    color: '#FFCCBC',
    rating: 4.9,
    reviews: 654,
    imagePlaceholder: '🍎'
  },
  {
    id: 15,
    name: 'Бессмертник',
    latinName: 'Helichrysum arenarium',
    imageUrl: 'https://images.unsplash.com/photo-1580748089189-8b8257b9f2e5?w=400',
    description: 'Бессмертник — гепатопротекторное и желчегонное средство. Стимулирует образование и отток желчи, обладает противовоспалительным действием.',
    symptoms: ['Боль в животе', 'Вздутие', 'Тошнота', 'Горечь во рту', 'Желтуха'],
    uses: 'Применяется при заболеваниях печени и желчного пузыря, дискинезии желчевыводящих путей, холецистите.',
    preparation: 'Заварить 1 столовую ложку цветков на стакан кипятка. Настоять 30 минут. Принимать по 1/3 стакана 3 раза в день за 30 минут до еды.',
    contraindications: 'Желчекаменная болезнь, обструкция желчных путей, повышенная кислотность, беременность.',
    benefits: 'Улучшает работу печени, стимулирует желчеотток, снимает воспаление, помогает при желтухе.',
    color: '#FFF3E0',
    rating: 4.7,
    reviews: 432,
    imagePlaceholder: '🌼'
  },
  {
    id: 16,
    name: 'Тысячелистник',
    latinName: 'Achillea millefolium',
    imageUrl: 'https://images.unsplash.com/photo-1628557042016-d6c6b9bf8e4b?w=400',
    description: 'Тысячелистник обладает кровоостанавливающим, противовоспалительным и спазмолитическим действием.',
    symptoms: ['Кровотечение', 'Воспаление', 'Боль в животе', 'Рана', 'Менструальные боли'],
    uses: 'Применяется при кровотечениях, воспалительных заболеваниях ЖКТ, спазмах, для улучшения аппетита.',
    preparation: 'Заварить 1 столовую ложку травы на стакан кипятка. Настоять 30 минут. Принимать по 1/3 стакана 3 раза в день.',
    contraindications: 'Беременность, повышенная свертываемость крови, тромбозы, гипотония.',
    benefits: 'Останавливает кровотечения, снимает воспаление, помогает при менструальных болях, улучшает аппетит.',
    color: '#E8F5E9',
    rating: 4.6,
    reviews: 543,
    imagePlaceholder: '🌿'
  },
  {
    id: 17,
    name: 'Душица',
    latinName: 'Origanum vulgare',
    imageUrl: 'https://images.unsplash.com/photo-1616683693504-3f7e9ad5f5b5?w=400',
    description: 'Душица обладает успокаивающим, отхаркивающим, антисептическим и спазмолитическим действием.',
    symptoms: ['Кашель', 'Стресс', 'Бессонница', 'Спазмы', 'Бронхит'],
    uses: 'Применяется при кашле, бронхите, нервном возбуждении, бессоннице, спазмах ЖКТ.',
    preparation: 'Заварить 1 столовую ложку травы на стакан кипятка. Настоять 15 минут. Принимать по 1/2 стакана 2 раза в день.',
    contraindications: 'Беременность, кормление грудью, тяжелые заболевания сердца, гипертония.',
    benefits: 'Помогает при кашле, успокаивает, снимает спазмы, улучшает аппетит.',
    color: '#F3E5F5',
    rating: 4.7,
    reviews: 654,
    imagePlaceholder: '🌸'
  },
  {
    id: 18,
    name: 'Эхинацея',
    latinName: 'Echinacea purpurea',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400',
    description: 'Эхинацея — мощный иммуномодулятор. Стимулирует иммунную систему, обладает противовирусным и антибактериальным действием.',
    symptoms: ['Простуда', 'Слабость', 'Кашель', 'Озноб', 'Боль в горле', 'Частые инфекции'],
    uses: 'Применяется для укрепления иммунитета, профилактики и лечения простудных заболеваний, при хронической усталости.',
    preparation: 'Заварить 1 чайную ложку травы на стакан кипятка. Настоять 15 минут. Принимать 2-3 раза в день курсом не более 10 дней.',
    contraindications: 'Аутоиммунные заболевания, туберкулез, беременность, кормление грудью.',
    benefits: 'Укрепляет иммунитет, помогает бороться с вирусами, ускоряет выздоровление, снижает частоту инфекций.',
    color: '#E1BEE7',
    rating: 4.8,
    reviews: 1867,
    imagePlaceholder: '🌸'
  }
];

// ========== КОМПОНЕНТ КАРТОЧКИ ==========
function HerbCard({ herb, onPress, isFavorite, onToggleFavorite }) {
  const [imageError, setImageError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const showImage = herb.imageUrl && !imageError;

  return (
    <Animated.View style={[styles.herbCardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={0.95} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <LinearGradient colors={[herb.color || '#e8f5e9', '#fff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.herbCard}>
          <View style={styles.herbCardLeft}>
            {showImage ? (
              <Image source={{ uri: herb.imageUrl }} style={styles.herbCardImage} onError={() => setImageError(true)} />
            ) : (
              <Text style={styles.herbCardIcon}>{herb.imagePlaceholder}</Text>
            )}
          </View>
          <View style={styles.herbCardCenter}>
            <Text style={styles.herbCardName}>{herb.name}</Text>
            <Text style={styles.herbCardLatin}>{herb.latinName}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{herb.rating}</Text>
              <Text style={styles.reviewsText}>({herb.reviews})</Text>
            </View>
            <View style={styles.herbCardSymptoms}>
              {herb.symptoms.slice(0, 2).map((s, i) => (
                <View key={i} style={styles.symptomTagSmall}><Text style={styles.symptomTagSmallText}>{s}</Text></View>
              ))}
              {herb.symptoms.length > 2 && <Text style={styles.moreSymptoms}>+{herb.symptoms.length - 2}</Text>}
            </View>
          </View>
          <TouchableOpacity style={styles.favoriteButton} onPress={(e) => { e.stopPropagation(); onToggleFavorite(herb.id); Vibration.vibrate(50); }}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========
export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentTip, setCurrentTip] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);

  const dailyTips = [
    "🌿 Ромашковый чай перед сном улучшает качество сна на 40%",
    "🍵 Имбирный чай с лимоном — лучшее средство при первых признаках простуды",
    "💜 Лавандовое масло в аромалампе снижает уровень тревожности за 10 минут",
    "📖 Настои трав лучше всего готовить в стеклянной или керамической посуде",
    "⚠️ Травы с осторожностью: всегда начинайте с малых доз",
    "🌱 Мята помогает при головной боли напряжения",
    "🍃 Шалфей уменьшает потливость на 50% при климаксе",
    "🌸 Календула — лучшее натуральное средство для заживления ран",
  ];

  const dailyFacts = [
    "📚 Ромашка используется в медицине более 5000 лет",
    "🔬 Имбирь содержит более 400 различных активных соединений",
    "🌍 Мята была найдена в египетских гробницах, датируемых 1000 годом до н.э.",
    "💊 Эхинацея — одно из самых изученных лекарственных растений",
    "💜 Лаванда получила название от латинского «lavare» — мыть",
    "🌸 Календулу называют «шафран бедняков»",
    "🌿 Крапива содержит больше железа, чем шпинат",
    "📖 В средневековье зверобой использовали для изгнания злых духов",
  ];

  const allSymptoms = [
    'Стресс', 'Бессонница', 'Головная боль', 'Тревожность',
    'Простуда', 'Кашель', 'Озноб', 'Боль в горле',
    'Тошнота', 'Боль в животе', 'Вздутие', 'Слабость',
    'Воспаление', 'Нервное напряжение', 'Рана', 'Раздражение',
    'Ожог', 'Воспаление десен', 'Депрессия', 'Анемия',
    'Кровотечение', 'Выпадение волос', 'Сердцебиение', 'Гипертония',
    'Спазмы', 'Укачивание', 'Авитаминоз', 'Бронхит'
  ];

  useEffect(() => {
    setCurrentTip(Math.floor(Math.random() * dailyTips.length));
    setCurrentFact(Math.floor(Math.random() * dailyFacts.length));
  }, []);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    Vibration.vibrate(30);
  };

  const toggleFavorite = (herbId) => {
    if (favorites.includes(herbId)) {
      setFavorites(favorites.filter(id => id !== herbId));
    } else {
      setFavorites([...favorites, herbId]);
    }
    Vibration.vibrate(50);
  };

  const getResults = () => {
    if (selectedSymptoms.length === 0) return [];
    return herbsDatabase
      .filter(herb => herb.symptoms.some(s => selectedSymptoms.includes(s)))
      .map(herb => ({
        ...herb,
        matchCount: herb.symptoms.filter(s => selectedSymptoms.includes(s)).length,
        matchPercent: Math.round((herb.symptoms.filter(s => selectedSymptoms.includes(s)).length / selectedSymptoms.length) * 100)
      }))
      .sort((a, b) => b.matchCount - a.matchCount);
  };

  // ГЛАВНЫЙ ЭКРАН
  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
        <LinearGradient colors={['#4caf50', '#2e7d32']} style={styles.hero}>
          <Text style={styles.heroTitle}>🌿 Фитотека</Text>
          <Text style={styles.heroSubtitle}>Лекарственные травы мира</Text>
        </LinearGradient>

        <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipTitle}>Совет дня</Text>
            <Text style={styles.tipText}>{dailyTips[currentTip]}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={styles.statNum}>{herbsDatabase.length}+</Text><Text style={styles.statLabel}>Растений</Text></View>
            <View style={styles.statItem}><Text style={styles.statNum}>{allSymptoms.length}+</Text><Text style={styles.statLabel}>Симптомов</Text></View>
            <View style={styles.statItem}><Text style={styles.statNum}>4.8</Text><Text style={styles.statLabel}>Рейтинг</Text></View>
          </View>

          <TouchableOpacity style={styles.mainBtn} onPress={() => setScreen('symptoms')} activeOpacity={0.9}>
            <LinearGradient colors={['#4caf50', '#2e7d32']} style={styles.mainBtnGradient}>
              <Text style={styles.mainBtnText}>🔍 Подбор по симптомам</Text>
              <Text style={styles.mainBtnSubtext}>Выберите ваши симптомы →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setScreen('encyclopedia')} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>📚 Энциклопедия трав</Text>
            <Text style={styles.secondaryBtnSubtext}>Изучите все растения →</Text>
          </TouchableOpacity>

          <View style={styles.factCard}>
            <Text style={styles.factIcon}>📖</Text>
            <Text style={styles.factTitle}>Факт дня</Text>
            <Text style={styles.factText}>{dailyFacts[currentFact]}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ЭНЦИКЛОПЕДИЯ
  if (screen === 'encyclopedia') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#4caf50', '#2e7d32']} style={styles.headerGradient}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Энциклопедия</Text>
          <Text style={styles.headerSubtitle}>{herbsDatabase.length} растений</Text>
        </LinearGradient>

        <FlatList
          data={herbsDatabase}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HerbCard
              herb={item}
              onPress={() => {
                setSelectedHerb(item);
                setScreen('detail');
              }}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  // ВЫБОР СИМПТОМОВ
  if (screen === 'symptoms') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#4caf50', '#2e7d32']} style={styles.headerGradient}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Выбор симптомов</Text>
          <Text style={styles.headerSubtitle}>Выберите то, что вас беспокоит</Text>
        </LinearGradient>

        <ScrollView style={styles.symptomsScroll} contentContainerStyle={styles.symptomsGrid}>
          {allSymptoms.map((symptom, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.symptomBtn, selectedSymptoms.includes(symptom) && styles.symptomBtnSelected]}
              onPress={() => toggleSymptom(symptom)}
              activeOpacity={0.7}
            >
              <Text style={[styles.symptomBtnText, selectedSymptoms.includes(symptom) && styles.symptomBtnTextSelected]}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.countText}>Выбрано: {selectedSymptoms.length}</Text>
          <TouchableOpacity
            style={[styles.findBtn, selectedSymptoms.length === 0 && styles.findBtnDisabled]}
            onPress={() => setScreen('results')}
            disabled={selectedSymptoms.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.findBtnText}>Найти травы →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // РЕЗУЛЬТАТЫ С ПРОЦЕНТОМ СОВПАДЕНИЯ
  if (screen === 'results') {
    const results = getResults();

    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#4caf50', '#2e7d32']} style={styles.headerGradient}>
          <TouchableOpacity onPress={() => setScreen('symptoms')} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Результаты</Text>
          <Text style={styles.headerSubtitle}>Найдено: {results.length} растений</Text>
        </LinearGradient>

        {results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌿</Text>
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptyText}>Попробуйте выбрать другие симптомы</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setScreen('symptoms')}>
              <Text style={styles.emptyBtnText}>← Вернуться</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <HerbCard
                  herb={item}
                  onPress={() => {
                    setSelectedHerb(item);
                    setScreen('detail');
                  }}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
                <View style={styles.matchWrapper}>
                  <View style={[styles.matchBar, { width: `${item.matchPercent}%`, backgroundColor: item.matchPercent >= 70 ? '#4caf50' : item.matchPercent >= 40 ? '#ff9800' : '#f44336' }]} />
                  <Text style={styles.matchText}>Совпадение: {item.matchPercent}%</Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    );
  }

  // ДЕТАЛЬНАЯ ИНФОРМАЦИЯ
  if (screen === 'detail' && selectedHerb) {
    return (
      <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[selectedHerb.color, '#FFFFFF']} style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setScreen('encyclopedia')} style={styles.detailBackBtn}>
            <Text style={styles.detailBackText}>←</Text>
          </TouchableOpacity>
          {selectedHerb.imageUrl ? (
            <Image source={{ uri: selectedHerb.imageUrl }} style={styles.detailImage} />
          ) : (
            <Text style={styles.detailIcon}>{selectedHerb.imagePlaceholder}</Text>
          )}
          <Text style={styles.detailName}>{selectedHerb.name}</Text>
          <Text style={styles.detailLatin}>{selectedHerb.latinName}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>{selectedHerb.rating}</Text>
            <Text style={styles.reviewsDetailText}>({selectedHerb.reviews} отзывов)</Text>
          </View>
        </LinearGradient>

        <View style={styles.detailContent}>
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>📖 Описание</Text>
            <Text style={styles.sectionText}>{selectedHerb.description}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>✨ Польза и свойства</Text>
            <Text style={styles.sectionText}>{selectedHerb.benefits}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>🌡️ Применение</Text>
            <Text style={styles.sectionText}>{selectedHerb.uses}</Text>
          </View>

          <View style={[styles.detailSection, styles.preparationBox]}>
            <Text style={styles.sectionTitle}>🍵 Способ приготовления</Text>
            <Text style={styles.preparationText}>{selectedHerb.preparation}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>✨ Показания</Text>
            <View style={styles.tagsRow}>
              {selectedHerb.symptoms.map((s, i) => (
                <View key={i} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
              ))}
            </View>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Противопоказания</Text>
            <Text style={styles.warningText}>{selectedHerb.contraindications}</Text>
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              🩺 ВНИМАНИЕ: Данное приложение не заменяет консультацию врача.
              При серьёзных заболеваниях обязательно обратитесь к специалисту.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
}

// ========== СТИЛИ ==========
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  hero: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  heroTitle: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  homeContent: { flex: 1, padding: 16 },
  tipCard: { backgroundColor: '#fff3e0', borderRadius: 20, padding: 16, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#ff9800' },
  tipIcon: { fontSize: 24, marginBottom: 8 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#ff9800', marginBottom: 8 },
  tipText: { fontSize: 14, color: '#666', lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: 'bold', color: '#4caf50' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  mainBtn: { marginBottom: 16, borderRadius: 20, overflow: 'hidden' },
  mainBtnGradient: { padding: 20, alignItems: 'center' },
  mainBtnText: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  mainBtnSubtext: { fontSize: 14, color: '#fff', opacity: 0.9 },
  secondaryBtn: { backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0' },
  secondaryBtnText: { fontSize: 18, fontWeight: 'bold', color: '#4caf50', marginBottom: 5 },
  secondaryBtnSubtext: { fontSize: 13, color: '#999' },
  factCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, alignItems: 'center' },
  factIcon: { fontSize: 32, marginBottom: 10 },
  factTitle: { fontSize: 16, fontWeight: 'bold', color: '#4caf50', marginBottom: 8 },
  factText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  headerGradient: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', marginBottom: 10 },
  backText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  symptomsScroll: { flex: 1, padding: 16 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  symptomBtn: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 30, borderWidth: 1, borderColor: '#ddd' },
  symptomBtnSelected: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  symptomBtnText: { fontSize: 14, color: '#333' },
  symptomBtnTextSelected: { color: '#fff' },
  footer: { backgroundColor: '#fff', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
  countText: { fontSize: 14, color: '#666' },
  findBtn: { backgroundColor: '#4caf50', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30 },
  findBtnDisabled: { backgroundColor: '#ccc' },
  findBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c5e2a', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  emptyBtn: { backgroundColor: '#4caf50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  emptyBtnText: { color: '#fff', fontSize: 16 },
  listContent: { paddingVertical: 16 },
  matchWrapper: { marginHorizontal: 16, marginTop: -8, marginBottom: 12, backgroundColor: '#f0f0f0', borderRadius: 20, overflow: 'hidden' },
  matchBar: { height: 4, borderRadius: 2 },
  matchText: { fontSize: 11, color: '#666', textAlign: 'right', paddingHorizontal: 12, paddingVertical: 4 },
  herbCardWrapper: { marginHorizontal: 16, marginBottom: 12 },
  herbCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20 },
  herbCardLeft: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  herbCardImage: { width: 60, height: 60, borderRadius: 30 },
  herbCardIcon: { fontSize: 32 },
  herbCardCenter: { flex: 1 },
  herbCardName: { fontSize: 18, fontWeight: 'bold', color: '#2c5e2a' },
  herbCardLatin: { fontSize: 11, color: '#999', fontStyle: 'italic' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 4 },
  ratingStar: { fontSize: 12, color: '#ffb300', marginRight: 3 },
  ratingText: { fontSize: 11, color: '#666', fontWeight: '500', marginRight: 4 },
  reviewsText: { fontSize: 10, color: '#999' },
  herbCardSymptoms: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  symptomTagSmall: { backgroundColor: 'rgba(76,175,80,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginRight: 6 },
  symptomTagSmallText: { fontSize: 10, color: '#4caf50' },
  moreSymptoms: { fontSize: 10, color: '#999' },
  favoriteButton: { padding: 8 },
  favoriteIcon: { fontSize: 24 },
  detailContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  detailHeader: { paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  detailBackBtn: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, justifyContent: 'center', zIndex: 1 },
  detailBackText: { fontSize: 28, color: '#2c5e2a', fontWeight: 'bold' },
  detailImage: { width: 120, height: 120, borderRadius: 60, marginTop: 20 },
  detailIcon: { fontSize: 80, marginTop: 20 },
  detailName: { fontSize: 28, fontWeight: 'bold', color: '#2c5e2a', marginTop: 15, textAlign: 'center' },
  detailLatin: { fontSize: 14, color: '#999', fontStyle: 'italic', marginTop: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  reviewsDetailText: { fontSize: 12, color: '#999', marginLeft: 4 },
  detailContent: { padding: 20 },
  detailSection: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c5e2a', marginBottom: 12 },
  sectionText: { fontSize: 14, color: '#444', lineHeight: 22 },
  preparationBox: { backgroundColor: '#e8f5e9' },
  preparationText: { fontSize: 14, color: '#2c5e2a', lineHeight: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#e3f2fd', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 12, color: '#1976d2' },
  warningBox: { backgroundColor: '#fff3e0', borderRadius: 20, padding: 18, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#ff9800' },
  warningTitle: { fontSize: 16, fontWeight: 'bold', color: '#ff9800', marginBottom: 10 },
  warningText: { fontSize: 13, color: '#666', lineHeight: 20 },
  disclaimer: { backgroundColor: '#ffebee', borderRadius: 16, padding: 16, marginBottom: 30 },
  disclaimerText: { fontSize: 12, color: '#c62828', lineHeight: 18, textAlign: 'center' },
});
