/* More Iraqi data: extra words, phrases and the verb table. Written from general knowledge of Baghdadi Iraqi Arabic; not yet checked by a native speaker. */
const EXTRA_WORDS = `
monday|الاثنين|il-ithneen
tuesday|الثلاثاء|ith-thalaatha
wednesday|الأربعاء|il-arba3aa
thursday|الخميس|il-khamees
friday|الجمعة|ij-jum3a
saturday|السبت|is-sabit
sunday|الأحد|il-a7ad
january|كانون الثاني|kaanoon ith-thaani
february|شباط|shbaat
march|آذار|aathaar
april|نيسان|neesaan
may|أيار|ayyaar
june|حزيران|7zeeraan
july|تموز|tammooz
august|آب|aab
september|أيلول|aylool
october|تشرين الأول|tishreen il-awwal
november|تشرين الثاني|tishreen ith-thaani
december|كانون الأول|kaanoon il-awwal
red|احمر|a7mar
blue|ازرق|azrag
green|اخضر|akhdar
yellow|اصفر|asfar
white|ابيض|abyad
black|اسود|aswad
brown|بني|bunni
grey/gray|رمادي|ramaadi
pink|وردي|wardi
eleven|احدعش|a7dai3sh
twelve|اثنعش|ithn3ash
thirteen|ثلطعش|thultu3ash
fourteen|اربعطعش|arba3tu3ash
fifteen|خمسطعش|khamstu3ash
sixteen|ستطعش|sittu3ash
seventeen|سبعطعش|sab3tu3ash
eighteen|ثمنطعش|thamntu3ash
nineteen|تسعطعش|tis3tu3ash
thirty|ثلاثين|thalaatheen
forty|اربعين|arba3een
sixty|ستين|sitteen
seventy|سبعين|sab3een
eighty|ثمانين|thamaaneen
ninety|تسعين|tis3een
two hundred|ميتين|miiteen
o'clock|الساعة|is-saa3a
noon|الظهر|iz-zuhur
midnight|نص الليل|nuss il-layl
week|اسبوع|usboo3
weekend|عطلة نهاية الاسبوع|3utlat nihaayat il-usboo3
holiday/vacation|عطلة|3utla
birthday|عيد ميلاد|3eed meelaad
wedding|عرس|3irs
party|حفلة|7afla
gift/present|هدية|hadiyya
head|راس|raas
face|وجه|wijih
mouth|فم|fumm
nose|ايف|eef
ear|اذن|uthun
neck|رگبة|rigba
back|ظهر|dhahar
heart|گلب|galib
throat|حلگ|7alig
finger|اصبع|isba3
foot|رجل|rijil
skin|جلد|jild
hair|شعر|sha3ar
beard|لحية|li7ya
hot water|ماي حار|maay 7aar
cold water|ماي بارد|maay baarid
bread|خبز|khubiz
kebab|كباب|kabaab
lamb|لحم غنم|la7am ghanam
beef|لحم بگر|la7am bagar
shawarma|شاورما|shaawarma
falafel|فلافل|falaafil
hummus|حمص|7ummus
yogurt|لبن|laban
butter|دهن|dihin
honey|عسل|3asal
lemon|ليمون|leemoon
cucumber|خيار|khyaar
carrot|جزر|jizar
garlic|ثوم|thoom
mango|انبه|anba
grapes|عنب|3inab
watermelon|رگي|riggi
pomegranate|رمان|rummaan
fruit juice|عصير|3aseer
soft drink|مشروب غازي|mashroob ghaazi
shirt|گميص|gmees
trousers/pants|بنطرون|bantaroon
dress|فستان|fistaan
jacket|جاكيت|jaakeet
hat|قبعة|gubba3a
bag|چنطة|chanta
umbrella|شمسية|shamsiyya
glasses|نظارة|naddhaara
watch|ساعة ايد|saa3at eed
ring|خاتم|khaatim
blanket|بطانية|battaaniyya
towel|فوطة|foota
soap|صابون|saaboon
toothbrush|فرشاة اسنان|furshaat isnaan
toilet paper|ورق تواليت|wuraq tuwaaleet
shower|دوش|doosh
air conditioner|مكيف|mukayyif
fan|مروحة|marwa7a
light|ضوء|dhaw
electricity|كهرباء|kahrabaa
generator|مولدة|muwallida
fuel/petrol|بنزين|benzeen
tire|اطار|itaar
engine|محرك|mu7arrik
road|طريق|tareeg
traffic|زحمة|zi7ma
checkpoint|سيطرة|saytara
taxi driver|سائق تكسي|saayiq taksi
airport|مطار|mataar
flight|رحلة|ri7la
visa|فيزا|feeza
border|حدود|7udood
suitcase|چنطة سفر|chantat safar
reservation/booking|حجز|7ajiz
single room|غرفة مفردة|ghurfa mufrada
double room|غرفة مزدوجة|ghurfa muzdawija
key card|كارت|kaart
receipt|وصل|wasil
discount|تخفيض|takhfeedh
cheap|رخيص|rikheeS
sale|تخفيضات|takhfeedhaat
doctor|دكتور|doktoor
nurse|ممرض|mumarridh
dentist|دكتور اسنان|doktoor isnaan
fever|حمى|7ummaa
cough|سعال|su3aal
cold (illness)|زكام|zukaam
headache|صداع|sudaa3
stomachache|وجع بطن|waja3 batin
allergy|حساسية|7asaasiyya
pill/tablet|حبة|7abba
prescription|وصفة|waSfa
insurance|تأمين|ta'meen
ambulance|اسعاف|is3aaf
fire|حريق|7areeq
thief|حرامي|7araami
danger|خطر|khatar
sun|شمس|shams
moon|گمر|gamar
sky|سما|sama
cloud|غيمة|gheema
wind|هوا|hawa
snow|ثلج|thalij
hot weather|حر|7arr
cold weather|برد|bard
teacher|مدرس|mudarris
lawyer|محامي|mu7aami
engineer|مهندس|muhandis
soldier|جندي|jundi
farmer|فلاح|fallaa7
worker|عامل|3aamil
manager|مدير|mudeer
company|شركة|sharika
meeting|اجتماع|ijtimaa3
contract|عقد|3agid
salary|راتب|raatib
work|شغل|shughul
job|وظيفة|wadheefa
project|مشروع|mashroo3
customer|زبون|zaboon
partner|شريك|shareek
boss|رئيس|ra'ees
good|زين|zain
bad|خايس|khaayis
beautiful|حلو|7ilu
ugly|مو حلو|mu 7ilu
young|شاب|shaab
old person|عجوز|3ajooz
strong|گوي|gawi
weak|ضعيف|dha3eef
rich|غني|ghani
poor|فگير|fagir
safe|امين|ameen
dangerous|خطر|khatar
important|مهم|muhim
possible|ممكن|mumkin
impossible|مستحيل|mustaheel
true|صحيح|sa7ee7
false|غلط|ghalat
quiet|هادي|haadi
noisy|مزعج|muz3ij
wet|مبلل|mubalal
dry|ناشف|naashif
heavy|ثگيل|thagiil
light (weight)|خفيف|khafeef
loud|عالي|3aali
polite|مؤدب|mu'addab
welcome|هلا|hala
promise|وعد|wa3ad
secret|سر|sirr
love|حب|7ubb
peace|سلام|salaam
god|الله|allah
life|حياة|7ayaa
world|دنيا|dunya
country|بلد|balad
language|لغة|lugha
word|كلمة|kilma
sentence|جملة|jumla
today|اليوم|il-yoom
tonight|الليلة|il-layla
this morning|هالصبح|hass-subuh
next week|الاسبوع الجاي|il-usboo3 ij-jaay
last night|البارحة بالليل|il-baar7a bil-layl
every day|كل يوم|kull yoom
again|مرة ثانية|marra thaanya
together|سوا|siwa
quickly|بسرعة|bsur3a
slowly|بالراحة|bir-raaha
maybe|يمكن|yimkin
of course|اكيد|akeed
please|رجاءً|rijaa'an
welcome to iraq|هلا بيك بالعراق|hala beek bil-3iraag
`;

const EXTRA_PHRASES = `
greet|how have you been?|شخبارك؟|shakhbaarak?
greet|i'm doing well, and you?|آني زين، وإنت؟|ani zain, w-inta?
greet|it's a pleasure to meet you|تشرفنا، اهلا وسهلا|tsharrafna, ahlan wa sahlan
greet|may god keep you|الله يخليك|allah ykhaleek
greet|may god bless you|الله يبارك بيك|allah ybaarik beek
greet|god be with you|الله وياك|allah wiyyaak
greet|welcome to iraq|هلا بيك بالعراق|hala beek bil-3iraag
greet|what is your name, sir?|شنو اسمك استاذ؟|shinu ismak ustaadh?
basic|i'm sorry, i didn't understand|آسف، ما فتهمت|aasif, ma fthamit
basic|can you speak more slowly?|تگدر تحچي بالراحة؟|tigdar tihchi bir-raaha?
basic|how do you say this in iraqi?|شلون تگولها بالعراقي؟|shlon tgoolha bil-3iraagi?
basic|what do you mean?|شتقصد؟|shtigsud?
basic|i don't speak iraqi|ما احچي عراقي|ma ahchi 3iraagi
basic|i'm learning arabic|دا اتعلم عربي|da ata3allam 3arabi
basic|i am not sure|مو متأكد|mu muta'akkid
basic|never mind|ما عليك/خلها|ma 3aleek/khalha
basic|it doesn't matter|مو مهم|mu muhim
basic|that's fine|ماكو مشكلة، زين|maku mushkila, zain
basic|really?|صدگ؟|sidig?
basic|of course|اكيد|akeed
basic|exactly|بالضبط|bid-dabit
basic|i don't think so|ما اعتقد|ma a3tigid
basic|i think so|اعتقد هيچ|a3tigid heech
travel|where is the nearest hotel?|وين اگرب فندق؟|ween agrab funduq?
travel|where is the nearest pharmacy?|وين اگرب صيدلية؟|ween agrab saydaliyya?
travel|where is the nearest hospital?|وين اگرب مستشفى؟|ween agrab mustashfa?
travel|where is the nearest bank?|وين اگرب بنك؟|ween agrab bank?
travel|where is the nearest atm?|وين اگرب صراف آلي؟|ween agrab sarraaf aali?
travel|is it far from here?|بعيد من هنا؟|ba3eed min hnaa?
travel|can i walk there?|اگدر امشي لهناك؟|agdar amshi lihnaak?
travel|how many minutes?|شكد دقيقة؟|shgad dagiiga?
travel|go straight then turn right|روح دغري وبعدين دور يمين|rooh dughri w-ba3deen door yameen
travel|go straight then turn left|روح دغري وبعدين دور يسار|rooh dughri w-ba3deen door yasaar
travel|it's next to the mosque|يم الجامع|yamm ij-jaami3
travel|it's in front of the hotel|گدام الفندق|gdaam il-funduq
travel|it's behind the market|ورا السوگ|wara is-soog
travel|please take me to this address|خذني لهذا العنوان لو سمحت|khuthni lihaatha il-3unwaan law samaHt
travel|how much to go to the airport?|بيش للمطار؟|beesh lil-mataar?
travel|please wait here|انتظرني هنا لو سمحت|intithirni hnaa law samaHt
travel|i'm going to baghdad|آني رايح لبغداد|ani raayi7 libaghdaad
travel|what time does the bus leave?|شوكت يمشي الباص؟|shwakit yimshi il-baas?
travel|i would like a one way ticket|اريد تذكرة ذهاب|areed tathkirat dhihaab
travel|i would like a return ticket|اريد تذكرة ذهاب وإياب|areed tathkirat dhihaab w-iyaab
travel|is breakfast included?|الفطور مشمول؟|il-futoor mashmool?
travel|what time is check out?|شوكت الخروج من الفندق؟|shwakit il-khurooj min il-funduq?
travel|the air conditioner is not working|المكيف ما يشتغل|il-mukayyif ma yishtighil
travel|there is no electricity|ماكو كهرباء|maku kahrabaa
travel|there is no hot water|ماكو ماي حار|maku maay 7aar
food|i would like some tea|اريد چاي|areed chaay
food|can i have the menu?|اگدر آخذ المنيو؟|agdar aakhuth il-menyu?
food|what is today's special?|شنو طبق اليوم؟|shinu tabag il-yoom?
food|i'll have the same|آخذ نفس الشي|aakhuth nafs ish-shee
food|without onions please|بدون بصل لو سمحت|bidoon basal law samaHt
food|a little more rice please|شوية تمن بعد لو سمحت|shwayya timman ba3ad law samaHt
food|this is very tasty|هذا كلش طيب|haatha kullish tayyib
food|the food is cold|الاكل بارد|il-akil baarid
food|i'm full|شبعت|shiba3it
food|i'm allergic to nuts|عندي حساسية من المكسرات|3indi 7asaasiyya min il-mukassaraat
food|i don't eat pork|ما آكل لحم خنزير|ma aakul la7am khinzeer
food|please bring the bill|جيب الحساب لو سمحت|jeeb il-7isaab law samaHt
food|keep the change|الباقي لك|il-baagi lak
food|let's eat|يلا ناكل|yalla naakul
food|help yourself|تفضل|tfaddal
food|this is delicious, thank you|هذا لذيذ، تسلم ايدك|haatha lazeez, tislam eedak
shop|how much for two?|بيش الثنين؟|beesh ith-thneen?
shop|is this the final price?|هذا آخر سعر؟|haatha aakhir si3ir?
shop|that is too much|هذا هواية|haatha hawaaya
shop|i have only dinars|عندي بس دنانير|3indi bass danaaneer
shop|i have dollars|عندي دولارات|3indi dolaaraat
shop|can i pay by card?|اگدر ادفع بالكارت؟|agdar adfa3 bil-kaart?
shop|where is the cashier?|وين الكاشير؟|ween il-kaasheer?
shop|i'm looking for a gift|ادور على هدية|adawwir 3ala hadiyya
shop|show me another one|ورّيني واحد ثاني|wirreeni waa7id thaani
shop|i don't have change|ماعندي فراطة|ma 3indi faraata
health|i need to see a doctor|لازم اشوف دكتور|laazim ashoof doktoor
health|i feel dizzy|دايخ|daayikh
health|i can't breathe|ما اگدر اتنفس|ma agdar atnaffas
health|i have pain in my chest|عندي وجع بصدري|3indi waja3 b-sadri
health|my stomach hurts|بطني يوجعني|batni yoojaani
health|my head hurts|راسي يوجعني|raasi yoojaani
health|i have a toothache|سني يوجعني|sinni yoojaani
health|i am diabetic|عندي سكر|3indi sukkar
health|i take this medicine every day|آخذ هذا الدواء كل يوم|aakhuth haatha id-dawa kull yoom
health|where can i find a doctor?|وين الگي دكتور؟|ween algi doktoor?
health|call my family please|اتصل بأهلي لو سمحت|ittasil b-ahli law samaHt
health|please call the police|اتصلوا بالشرطة لو سمحت|ittasiloo bish-shurta law samaHt
health|i have been robbed|انسرگت|insirgat
health|my phone was stolen|انسرگ تلفوني|insirag telefooni
health|i lost my wallet|ضيعت محفظتي|dayya3it ma7fadhti
health|i need to go to the embassy|لازم اروح للسفارة|laazim arooh lis-safaara
health|i am safe|آني بأمان|ani b-amaan
social|you speak very well|تحچي زين كلش|tihchi zain kullish
social|your country is beautiful|بلدكم حلو كلش|baladkum 7ilu kullish
social|thank you for your hospitality|شكراً على ضيافتكم|shukran 3ala dhiyaaftkum
social|god bless you|الله يبارك بيك|allah ybaarik beek
social|i hope you are well|ان شاء الله انت زين|inshaalla inta zain
social|how is your family?|شلون اهلك؟|shlon ahlak?
social|how old are you?|شكد عمرك؟|shgad 3umrak?
social|are you married?|متزوج؟|mitzawwij?
social|do you have children?|عندك جهال؟|3indak juhhaal?
social|i am married|آني متزوج|ani mitzawwij
social|i am single|آني اعزب|ani a3zab
social|i work in an office|اشتغل بمكتب|ashtaghil b-maktab
social|what do you do for work?|شتشتغل؟|shtishtighil?
social|let's take a photo|يلا ناخذ صورة|yalla naakhuth soora
social|can i take a photo?|اگدر آخذ صورة؟|agdar aakhuth soora?
social|i enjoyed it very much|استمتعت كلش|istamta3it kullish
social|see you on friday|اشوفك الجمعة|ashoofak ij-jum3a
work|nice to meet you, i am the manager|تشرفنا، آني المدير|tsharrafna, ani il-mudeer
work|i would like to schedule a meeting|اريد احدد اجتماع|areed a7addid ijtimaa3
work|i will send you the details|راح ارسلك التفاصيل|raa7 arsilak it-tafaaseel
work|please confirm by message|اكد لي برسالة لو سمحت|akkidli b-risaala law samaHt
work|what is the price per month?|شكد السعر بالشهر؟|shgad is-si3ir bish-shahar?
work|let's sign the contract|يلا نوقع العقد|yalla nwaqqi3 il-3agid
work|the connection is bad|الانترنت ضعيف|il-internet dha3eef
work|my battery is low|البطارية خلصت تقريباً|il-baataariyya khilsat tagreeban
work|can i charge my phone here?|اگدر اشحن تلفوني هنا؟|agdar ashchin telefooni hnaa?
work|i don't have a signal|ماكو شبكة|maku shabaka
`;

/* lemma|I-form present|past: a single word = 3rd person masculine past (other persons are built from it), or "I,he,she,we,they" for irregular verbs.
   Present tense for you/he/she/we/they is built from the I-form. */
const VERBS = `
want|اريد|
need|احتاج|
go|اروح|رحت,راح,راحت,رحنا,راحوا
come|اجي|جيت,جا,جات,جينا,جوا
eat|آكل|اكل
drink|اشرب|شرب
see|اشوف|شفت,شاف,شافت,شفنا,شافوا
hear|اسمع|سمع
speak|احچي|حچيت,حچى,حچت,حچينا,حچوا
say|اگول|گلت,گال,گالت,گلنا,گالوا
know|ادري|عرف
understand|افتهم|فتهم
buy|اشتري|اشتريت,اشترى,اشترت,اشترينا,اشتروا
sell|ابيع|بعت,باع,باعت,بعنا,باعوا
pay|ادفع|دفع
take|آخذ|اخذ
give|اعطي|اعطيت,اعطى,اعطت,اعطينا,اعطوا
bring|اجيب|جبت,جاب,جابت,جبنا,جابوا
do|اسوي|سويت,سوى,سوت,سوينا,سووا
return|ارجع|رجع
sleep|انام|نمت,نام,نامت,نمنا,ناموا
work|اشتغل|اشتغل
help|اساعد|ساعد
book|احجز|حجز
call|اتصل|اتصل
sit|اگعد|گعد
visit|ازور|زار
learn|اتعلم|تعلم
study|ادرس|درس
ask|اسأل|سأل
open|افتح|فتح
close|اسكر|سكر
stop|اوگف|وگف
wait|انتظر|انتظر
find|الگي|لگيت,لگى,لگت,لگينا,لگوا
search|ادور|دور
send|ارسل|ارسل
write|اكتب|كتب
read|اگرا|گريت,گرا,گرت,گرينا,گروا
walk|امشي|مشيت,مشى,مشت,مشينا,مشوا
live|اسكن|سكن
stay|ابقى|بقيت,بقى,بقت,بقينا,بقوا
leave|اطلع|طلع
arrive|اوصل|وصل
start|ابدي|بديت,بدا,بدت,بدينا,بدوا
finish|اخلص|خلص
try|اجرب|جرب
forget|انسى|نسيت,نسى,نست,نسينا,نسوا
remember|اتذكر|تذكر
think|افكر|فكر
change|اغير|غير
love|احب|
like|احب|
cook|اطبخ|طبخ
wash|اغسل|غسل
clean|انظف|نظف
rent|اجر|
pray|اصلي|
travel|اسافر|سافر
meet|اتقابل|تقابل
`;
