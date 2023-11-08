export type KanjiList = [string, string, {kunyomi: string, onyomi: string}];
export type Alphabets = (string[] & KanjiList)[];

const hiragana: ReadonlyArray<Array<string>> = [
    ["あ", "a", "group a", "kunten"],
    ["い", "i", "group a", "kunten"],
    ["う", "u", "group a", "kunten"],
    ["え", "e", "group a", "kunten"],
    ["お", "o", "group a", "kunten"],

    ["は", "ha", "group h", "kunten"],
    ["ひ", "hi", "group h", "kunten"],
    ["ふ", "fu", "group h", "kunten"],
    ["へ", "he", "group h", "kunten"],
    ["ほ", "ho", "group h", "kunten"],

    ["た", "ta", "group t", "kunten"],
    ["ち", "chi", "group t", "kunten"],
    ["つ", "tsu", "group t", "kunten"],
    ["て", "te", "group t", "kunten"],
    ["と", "to", "group t", "kunten"],

    ["か", "ka", "group k", "kunten"],
    ["き", "ki", "group k", "kunten"],
    ["く", "ku", "group k", "kunten"],
    ["け", "ke", "group k", "kunten"],
    ["こ", "ko", "group k", "kunten"],

    ["な", "na", "group n", "kunten"],
    ["に", "ni", "group n", "kunten"],
    ["ぬ", "nu", "group n", "kunten"],
    ["ね", "ne", "group n", "kunten"],
    ["の", "no", "group n", "kunten"],

    ["ま", "ma", "group m", "kunten"],
    ["み", "mi", "group m", "kunten"],
    ["む", "mu", "group m", "kunten"],
    ["め", "me", "group m", "kunten"],
    ["も", "mo", "group m", "kunten"],
    
    ["ら", "ra", "group r", "kunten"],
    ["り", "ri", "group r", "kunten"],
    ["る", "ru", "group r", "kunten"],
    ["れ", "re", "group r", "kunten"],
    ["ろ", "ro", "group r", "kunten"],

    ["さ", "sa", "group s", "kunten"],
    ["し", "shi", "group s", "kunten"],
    ["す", "su", "group s", "kunten"],
    ["せ", "se", "group s", "kunten"],
    ["そ", "so", "group s", "kunten"],

    ["や", "ya", "group y", "kunten"],
    ["ゆ", "yu", "group y", "kunten"],
    ["よ", "yo", "group y", "kunten"],

    ["わ", "wa", "group w", "kunten"],
    ["を", "o, wo", "group w", "kunten"],
    
    ["ん", "n", "only n", "kunten"],

    ["が", "ga", "group g", "dakuten"],
    ["ぎ", "gi", "group g", "dakuten"],
    ["ぐ", "gu", "group g", "dakuten"],
    ["げ", "ge", "group g", "dakuten"],
    ["ご", "go", "group g", "dakuten"],

    ["ば", "ba", "group b", "dakuten"],
    ["び", "bi", "group b", "dakuten"],
    ["ぶ", "bu", "group b", "dakuten"],
    ["べ", "be", "group b", "dakuten"],
    ["ぼ", "bo", "group b", "dakuten"],

    ["だ", "da", "group d", "dakuten"],
    ["ぢ", "di", "group d", "dakuten"],
    ["づ", "zu", "group d", "dakuten"],
    ["で", "de", "group d", "dakuten"],
    ["ど", "do", "group d", "dakuten"],

    ["ざ", "za", "group z", "dakuten"],
    ["じ", "ji", "group z", "dakuten"],
    ["ず", "zu", "group z", "dakuten"],
    ["ぜ", "ze", "group z", "dakuten"],
    ["ぞ", "zo", "group z", "dakuten"],

    ["ぱ", "pa", "group p", "handakuten"],
    ["ぴ", "pi", "group p", "handakuten"],
    ["ぷ", "pu", "group p", "handakuten"],
    ["ぺ", "pe", "group p", "handakuten"],
    ["ぽ", "po", "group p", "handakuten"],
]

const katakana: ReadonlyArray<Array<string>> =[
    ["ア", "a", "group a", "kunten"],
    ["イ", "i", "group a", "kunten"],
    ["ウ", "u", "group a", "kunten"],
    ["エ", "e", "group a", "kunten"],
    ["オ", "o", "group a", "kunten"],
    
    ["ハ", "ha", "group h", "kunten"],
    ["ヒ", "hi", "group h", "kunten"],
    ["フ", "fu", "group h", "kunten"],
    ["ヘ", "he", "group h", "kunten"],
    ["ホ", "ho", "group h", "kunten"],
    
    ["タ", "ta", "group t", "kunten"],
    ["チ", "chi", "group t", "kunten"],
    ["ツ", "tsu", "group t", "kunten"],
    ["テ", "te", "group t", "kunten"],
    ["ト", "to", "group t", "kunten"],
    
    ["カ", "ka", "group k", "kunten"],
    ["キ", "ki", "group k", "kunten"],
    ["ク", "ku", "group k", "kunten"],
    ["ケ", "ke", "group k", "kunten"],
    ["コ", "ko", "group k", "kunten"],
    
    ["ナ", "na", "group n", "kunten"],
    ["ニ", "ni", "group n", "kunten"],
    ["ヌ", "nu", "group n", "kunten"],
    ["ネ", "ne", "group n", "kunten"],
    ["ノ", "no", "group n", "kunten"],
    
    ["マ", "ma", "group m", "kunten"],
    ["ミ", "mi", "group m", "kunten"],
    ["ム", "mu", "group m", "kunten"],
    ["メ", "me", "group m", "kunten"],
    ["モ", "mo", "group m", "kunten"],
    
    ["ラ", "ra", "group r", "kunten"],
    ["リ", "ri", "group r", "kunten"],
    ["ル", "ru", "group r", "kunten"],
    ["レ", "re", "group r", "kunten"],
    ["ロ", "ro", "group r", "kunten"],
    
    ["サ", "sa", "group s", "kunten"],
    ["シ", "shi", "group s", "kunten"],
    ["ス", "su", "group s", "kunten"],
    ["セ", "se", "group s", "kunten"],
    ["ソ", "so", "group s", "kunten"],
    
    ["ヤ", "ya", "group y", "kunten"],
    ["ユ", "yu", "group y", "kunten"],
    ["ヨ", "yo", "group y", "kunten"],
    
    ["ワ", "wa", "group w", "kunten"],
    ["ヲ", "o, wo", "group w", "kunten"],
    
    ["ン", "n", "only n", "kunten"],
    
    ["ガ", "ga", "group g", "dakuten"],
    ["ギ", "gi", "group g", "dakuten"],
    ["グ", "gu", "group g", "dakuten"],
    ["ゲ", "ge", "group g", "dakuten"],
    ["ゴ", "go", "group g", "dakuten"],
    
    ["バ", "ba", "group b", "dakuten"],
    ["ビ", "bi", "group b", "dakuten"],
    ["ブ", "bu", "group b", "dakuten"],
    ["ベ", "be", "group b", "dakuten"],
    ["ボ", "bo", "group b", "dakuten"],
    
    ["ダ", "da", "group d", "dakuten"],
    ["ヂ", "di", "group d", "dakuten"],
    ["ヅ", "zu", "group d", "dakuten"],
    ["デ", "de", "group d", "dakuten"],
    ["ド", "do", "group d", "dakuten"],
    
    ["ザ", "za", "group z", "dakuten"],
    ["ジ", "ji", "group z", "dakuten"],
    ["ズ", "zu", "group z", "dakuten"],
    ["ゼ", "ze", "group z", "dakuten"],
    ["ゾ", "zo", "group z", "dakuten"],
    
    ["パ", "pa", "group p", "handakuten"],
    ["ピ", "pi", "group p", "handakuten"],
    ["プ", "pu", "group p", "handakuten"],
    ["ペ", "pe", "group p", "handakuten"],
    ["ポ", "po", "group p", "handakuten"],
]

export {hiragana, katakana};