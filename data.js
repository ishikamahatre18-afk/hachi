/* Hachi offline data: Iraqi Arabic (Baghdadi-leaning) <-> English.
   Line format:  PHRASES  cat|english variants|iraqi variants|latin (arabizi) variants
                 WORDS    english variants|iraqi variants|latin variants   (prefix "v:" marks a verb, 1st person form)
                 PATTERNS english pattern|iraqi pattern|latin pattern      (* = wildcard, ">" = English to Iraqi only)
   Variants are separated by "/". The first variant is the one shown as output. */

const CATS = [
  ["greet", "Greetings"], ["basic", "Essentials"], ["travel", "Getting around"], ["food", "Food & tea"],
  ["shop", "Shopping & money"], ["health", "Health & safety"], ["social", "Friends & feelings"], ["work", "Work & tech"]
];

const PHRASES = `
greet|hello/hi/hey|هلا/هلو/مرحبا|hala/hello/marhaba
greet|peace be upon you|السلام عليكم|as-salaamu 3alaykum
greet|and peace be upon you|وعليكم السلام|wa 3alaykum is-salaam
greet|welcome|هلا بيك/اهلا وسهلا|hala beek/ahlan wa sahlan
greet|good morning|صباح الخير|sabaah il-khair
greet|good morning (reply)|صباح النور|sabaah in-noor
greet|good evening|مساء الخير|masaa il-khair
greet|good evening (reply)|مساء النور|masaa in-noor
greet|good night|تصبح على خير|tusbih 3ala khair
greet|how are you?/how are you (to a man)|شلونك؟|shlonak?
greet|how are you (to a woman)|شلونچ؟|shlonich?
greet|what's up?/what's new?|شكو ماكو؟|shaku maku?
greet|nothing new|ماكو شي جديد|maku shee jdeed
greet|i'm fine, thank god/i am fine/i'm good|زين الحمد لله/آني زين|zain il-7amdulillah/ani zain
greet|and you?|وإنت؟|w-inta?
greet|what's your name?|شنو اسمك؟|shinu ismak?
greet|nice to meet you|تشرفنا/فرصة سعيدة|tsharrafna/forsa sa3eeda
greet|where are you from?|إنت من وين؟/منين إنت؟|inta min ween?/minayn inta?
greet|i am from iraq|آني من العراق|ani min il-3iraag
greet|goodbye/bye|مع السلامة|ma3 is-salaama
greet|see you later/see you soon|اشوفك بعدين/نشوفك على خير|ashoofak ba3deen/nshoofak 3ala khair
greet|see you tomorrow|اشوفك باچر|ashoofak baachir
greet|take care|دير بالك على نفسك|deer baalak 3ala nafsak
greet|god willing|ان شاء الله|inshaalla
greet|thank god|الحمد لله|il-7amdulillah
greet|how is the family?|شلون اهلك؟/شلون العائلة؟|shlon ahlak?/shlon il-3aa'ila?
basic|yes|إي/ايوه/نعم|ey/eewa/na3am
basic|no|لا|la
basic|please|لو سمحت/رجاءً|law samaHt/rijaa'an
basic|thank you|شكراً/ممنون/تسلم|shukran/mamnoon/tislam
basic|thank you very much|شكراً جزيلاً/ألف شكر/كلش ممنون|shukran jazeelan/alf shukur/kullish mamnoon
basic|you're welcome|عفواً/ولو|3afwan/wlaw
basic|no problem|ماكو مشكلة|maku mushkila
basic|i'm sorry/sorry|آسف/اسف|aasif
basic|excuse me|اسمحلي/لو سمحت|ismahli/law samaHt
basic|i don't understand|ما افتهم/ما فاهم|ma aftihim/ma faahim
basic|i understand|افتهم/فاهم|aftihim/faahim
basic|i don't know|ما ادري/ما اعرف|ma adri/ma a3rif
basic|do you speak english?|تحچي إنگليزي؟/تتكلم انكليزي؟|tihchi ingleezi?/titkallam ingleezi?
basic|i speak a little arabic|احچي عربي شوية|ahchi 3arabi shwayya
basic|i don't speak arabic|ما احچي عربي|ma ahchi 3arabi
basic|please speak slowly|احچي بالراحة لو سمحت|ahchi bir-raaha law samaHt
basic|can you repeat that?/say that again|تگدر تعيد؟|tigdar ti3eed?
basic|can you write it down?|تگدر تكتبها؟|tigdar tiktibha?
basic|what does this mean?|شنو يعني هذا؟|shinu y3ini haatha?
basic|what is this?|شنو هذا؟|shinu haatha?
basic|maybe|يمكن|yimkin
basic|okay/ok|زين/اوكي/ماشي|zain/okay/maashi
basic|right/correct|صح|sa7
basic|wrong|غلط|ghalat
basic|one moment/wait a moment|لحظة/شوية|la7za/shwayya
basic|hurry up|يلا بسرعة/بسرعة|yalla bsur3a
basic|let's go|يلا نروح/خل نروح|yalla nrooh/khal nrooh
basic|come here|تعال هنا|ta3aal hnaa
basic|i like it|يعجبني|y3ijibni
basic|i don't like it|ما يعجبني|ma y3ijibni
travel|where is the bathroom?|وين الحمام؟/وين التواليت؟|ween il-7ammaam?/ween it-tuwaaleet?
travel|i am lost/i'm lost|آني ضايع|ani daay3
travel|can you help me?|تگدر تساعدني؟|tigdar tsaa3idni?
travel|please help me/help me|ساعدني لو سمحت/ساعدني|saa3idni law samaHt/saa3idni
travel|turn right|دور يمين/لف يمين|door yameen/lif yameen
travel|turn left|دور يسار/لف يسار|door yasaar/lif yasaar
travel|go straight|دغري/على طول|dughri/3ala tool
travel|stop here|وگف هنا|wagguf hnaa
travel|is it far?|بعيد؟|ba3eed?
travel|is it near?/is it close?|گريب؟|gareeb?
travel|how far is it?|شكد بعيد؟|shgad ba3eed?
travel|how long does it take?|شكد ياخذ وكت؟|shgad yaakhuth wakit?
travel|take me to the airport|خذني للمطار|khuthni lil-mataar
travel|i need a taxi|اريد تكسي|areed taksi
travel|how much is the fare?|بيش الاجرة؟|beesh il-ujra?
travel|where can i buy a ticket?|وين اگدر اشتري تذكرة؟|ween agdar ashtiri tathkira?
travel|what time does it leave?|شوكت يمشي؟|shwakit yimshi?
travel|what time does it arrive?|شوكت يوصل؟|shwakit yoosal?
travel|i have a reservation|عندي حجز|3indi 7ajiz
travel|i need a room for one night|اريد غرفة لليلة وحدة|areed ghurfa lil-layla wa7da
travel|how much per night?|بيش الليلة؟|beesh il-layla?
travel|where is my luggage?|وين چنطتي؟/وين شنطتي؟|ween chantati?/ween shantati?
food|i'm hungry/i am hungry|آني جوعان|ani joo3aan
food|i'm thirsty/i am thirsty|آني عطشان|ani 3atshaan
food|water, please/water please|ماي لو سمحت|maay law samaHt
food|a table for two|طاولة لشخصين|taawila li-shakhsayn
food|the menu, please/menu please|المنيو لو سمحت|il-menyu law samaHt
food|what do you recommend?|شنو تنصحني؟|shinu tinsa7ni?
food|i'd like to order|اريد اطلب|areed atlub
food|the bill, please/check please/bill please|الحساب لو سمحت|il-7isaab law samaHt
food|it's delicious/delicious/this is delicious|خوش اكل/لذيذ|khosh akil/lazeez
food|no sugar/without sugar|بدون سكر|bidoon sukkar
food|with sugar|ويا سكر|wiyya sukkar
food|a glass of tea/a cup of tea|استكان چاي|istikaan chaay
food|tea with milk|چاي ويا حليب|chaay wiyya 7aleeb
food|i am vegetarian|آني نباتي|ani nabaati
food|is this halal?|هذا حلال؟|haatha 7alaal?
food|is it spicy?|هذا حار؟|haatha 7aar?
food|not spicy please|مو حار لو سمحت|mu 7aar law samaHt
food|more, please/more please|زيادة لو سمحت|zyaada law samaHt
food|enough, thank you|يكفي، تسلم|yikfi, tislam
food|bon appetit|بالعافية|bil-3aafya
food|bless your hands/thank you for the meal|عاشت ايدك|3aashat eedak
food|would you like tea?|تشرب چاي؟|tishrab chaay?
food|are you hungry?|جوعان؟|joo3aan?
food|do you need anything?|تحتاج شي؟|ti7taaj shee?
food|can i help you?|اگدر اساعدك؟|agdar asaa3dak?
food|yes, please/yes please|إي، لو سمحت|ey, law samaHt
food|no, thank you|لا، تسلم/لا، شكراً|la, tislam/la, shukran
food|that's all|هذا كل شي/هذا بس|haatha kull shee/haatha bass
food|is that all?|هذا كل شي؟|haatha kull shee?
shop|how much is this?|بيش هذا؟/شكد سعر هذا؟|beesh haatha?/shgad si3ir haatha?
shop|how much is it?/how much?|بيش؟|beesh?
shop|it's too expensive|هذا غالي كلش|haatha ghaali kullish
shop|can you lower the price?|تگدر تنزل السعر؟|tigdar tnazzil is-si3ir?
shop|cheaper, please/cheaper please|ارخص لو سمحت|arkhas law samaHt
shop|i'll take it/i will take it|آخذه|aakhithah
shop|i'm just looking|بس اتفرج|bass atfarraj
shop|do you accept cards?/do you take cards|تاخذون كارت؟|taakhthoon kaart?
shop|do you have change?/do you have small change|عندك فراطة؟|3indak faraata?
shop|where can i exchange money?|وين اگدر اصرف فلوس؟|ween agdar asarrif fuloos?
shop|what is the exchange rate?|شكد سعر الصرف؟|shgad si3ir is-sarif?
shop|do you have a bigger size?|عندك قياس اكبر؟|3indak giyaas akbar?
shop|do you have another color?|عندك لون ثاني؟|3indak loon thaani?
shop|can i try it on?|اگدر اجربه؟|agdar ajarribah?
shop|i want a receipt|اريد وصل|areed wasil
shop|it's a deal/deal|اتفقنا|ittifagna
health|i need a doctor|اريد دكتور|areed doktoor
health|i feel sick/i'm sick|آني مريض|ani mareedh
health|it hurts here|يوجعني هنا|yoojaani hnaa
health|i have a headache|عندي صداع|3indi sudaa3
health|i have a stomach ache|عندي وجع بطن|3indi waja3 batin
health|i have a fever|عندي حمى/عندي حرارة|3indi 7ummaa/3indi 7araara
health|i need medicine|اريد دواء|areed dawa
health|call an ambulance|اتصلوا بالاسعاف|ittasiloo bil-is3aaf
health|call the police|اتصلوا بالشرطة|ittasiloo bish-shurta
health|help!|الحگوني!/ساعدوني!|il7aguuni!/saa3idooni!
health|it's an emergency|هذي حالة طوارئ|haathi 7aalat tawaari'
health|i lost my passport|ضيعت جوازي|dayya3t jawaazi
health|i was robbed/i've been robbed|انسرگت|insirgat
health|i need help|اريد مساعدة|areed musaa3ada
health|fire!|حريق!|7areeq!
health|be careful|دير بالك|deer baalak
health|leave me alone|خلني بحالي|khallini b7aali
health|stop!|وگف!|wagguf!
social|i'm tired/i am tired|آني تعبان|ani ta3baan
social|i'm happy/i am happy|آني مبسوط|ani mabsoot
social|i'm sad/i'm upset|آني زعلان|ani za3laan
social|i'm busy/i am busy|آني مشغول|ani mashghool
social|i'm late/i am late|تأخرت|ta'akhkhart
social|i'm on my way|آني بالطريق|ani bit-tareeg
social|i miss you|اشتقتلك|ishtaqtilak
social|i love you|احبك|a7ibbak
social|congratulations|مبروك|mabrook
social|good luck|بالتوفيق|bit-tawfeeg
social|happy birthday|عيد ميلاد سعيد|3eed meelaad sa3eed
social|happy eid|كل عام وانتم بخير/عيدكم مبارك|kull 3aam w-intu bkhair/3eedkum mubaarak
social|ramadan kareem|رمضان كريم|ramadaan kareem
social|don't worry|لا تحمل هم|la ti7mil hamm
social|come in|تفضل/تدلل|tfaddal/tdallal
social|make yourself at home|البيت بيتك|il-bayt baytak
social|at your service|على راسي|3ala raasi
social|well done/thank you for your effort|يعطيك العافية|ya3teek il-3aafya
social|what are you doing?|شدتسوي؟|shdit-sawwi?
social|i'm working/i am working|دا اشتغل|da ashtaghil
social|i'm studying/i am studying|دا ادرس|da adris
social|what is the weather like?|شلون الجو؟|shlon il-jaw?
social|it's hot|الجو حار|il-jaw 7aar
social|it's cold|الجو بارد|il-jaw baarid
social|it's raining|دا تمطر|da tumtur
social|i agree|اتفق وياك/اوافق|attifig wiyyaak/awaafig
social|i disagree|ما اتفق وياك|ma attifig wiyyaak
social|really?|صدگ؟|sidig?
social|you're right|عندك حق|3indak 7agg
work|what time is it?|الساعة شكد؟|is-saa3a shgad?
work|what time is the meeting?|الاجتماع الساعة شكد؟|il-ijtimaa3 is-saa3a shgad?
work|let's meet tomorrow|خل نتقابل باچر|khal nitgaabal baachir
work|here is my card|هاي كارتي|haay kaarti
work|what's your phone number?|شنو رقم موبايلك؟|shinu raqm mobaaylak?
work|can you send me an email?|تگدر ترسلي ايميل؟|tigdar tirsilli eemeel?
work|do you have wifi?/do you have wi fi|عندكم واي فاي؟|3indkum waay faay?
work|what's the wifi password?|شنو باسورد الواي فاي؟|shinu baasword il-waay faay?
work|i'm here for work/i'm here on business|آني هنا شغل|ani hnaa shughul
work|i'm here as a tourist/i'm here on vacation|آني هنا سياحة|ani hnaa siyaa7a
work|how much will it cost?|شكد راح تكلف؟|shgad raa7 tkallif?
work|i will call you|راح اتصل بيك|raa7 attisil biik
work|call me|اتصل بيّه|ittisil biyya
work|send me the location|ارسلي الموقع|irsilli il-mawgi3
work|i'll be there soon|راح اوصل گريب|raa7 awsal gareeb
`;

const WORDS = `
i/me|آني|ani
you|إنت/إنتي|inta/inti
he/him|هو|huwwa
she/her|هي|hiyya
we/us|احنا|i7na
they/them|هم|humma
you all|انتو|intu
this|هذا/هذي/هاي|haatha/haathi/haay
that|هذاك/ذاك|haathaak
here|هنا|hnaa
there|هناك|hnaak
what|شنو/شو|shinu/shu
who|منو|minu
where|وين|ween
when|شوكت|shwakit
why|ليش|leesh
how|شلون|shlon
how much/how many|شكد|shgad
which|اي/ايهم|ay/ayhum
there is|اكو|aku
there is no/there is not/there isnt|ماكو|maku
will|راح|raa7
can/able to|اگدر|agdar
can not/cannot|ما اگدر|ma agdar
do not|ما|ma
not|مو|mu
and|و|w
or|او|aw
but|بس/لكن|bass/laakin
with|ويا|wiyya
from|من|min
on|على|3ala
at/by|عند|3ind
about|عن|3an
without|بدون|bidoon
because|لان|li'an
if|اذا|itha
also/too|هم|hamm
only|بس|bass
very/really|كلش|kullish
a lot/many/much|هواية|hawaaya
a little/little/few/some|شوية|shwayya
more|اكثر|akthar
less|اقل|agall
enough|يكفي|yikfi
all/every|كل|kull
everything|كلشي|kullshee
thing/something|شي|shee
nothing|ماكو شي|maku shee
now|هسه|hassa
later|بعدين|ba3deen
today|اليوم|il-yoom
tomorrow|باچر|baachir
yesterday|البارحة|il-baar7a
morning|الصبح/صباح|is-subuh/sabaa7
evening|المسا/مساء|il-masa/masaa
night|ليل|layl
day|يوم|yoom
week|اسبوع|usboo3
month|شهر|shahir
year|سنة|sana
hour|ساعة|saa3a
minute|دقيقة|dagiiga
time|وكت|wakit
always|دايماً|daayman
never|ابد|abad
sometimes|احياناً|a7yaanan
early|بدري|bidri
late|متأخر|mit'akhkhir
soon|گريب|gareeb
zero|صفر|sifir
one|واحد|waa7id
two|اثنين|ithneen
three|ثلاثة|thalaatha
four|اربعة|arba3a
five|خمسة|khamsa
six|ستة|sitta
seven|سبعة|sab3a
eight|ثمانية|thamaanya
nine|تسعة|tis3a
ten|عشرة|3ashra
twenty|عشرين|3ishreen
fifty|خمسين|khamseen
hundred|مية|miyya
thousand|الف|alif
half|نص|nuss
bathroom/toilet/restroom|حمام/تواليت|7ammaam/tuwaaleet
hotel|فندق|funduq
airport|مطار|mataar
bus station|كراج|garaaj
train station|محطة القطار|ma7attat il-qitaar
station|محطة|ma7atta
hospital|مستشفى|mustashfa
pharmacy|صيدلية|saydaliyya
bank|بنك|bank
market|سوگ|soog
mosque|جامع|jaami3
church|كنيسة|kaneesa
restaurant|مطعم|mat3am
embassy|سفارة|safaara
police station|مركز شرطة|markaz shurta
police|شرطة|shurta
street|شارع|shaari3
road|طريق|tareeg
city|مدينة|madeena
village|قرية|garya
house/home|بيت|bayt
room|غرفة|ghurfa
shop/store|محل|ma7all
school|مدرسة|madrasa
university|جامعة|jaam3a
office|مكتب|maktab
river|نهر|nahir
bridge|جسر|jisir
park|حديقة|7adeega
iraq|العراق|il-3iraag
baghdad|بغداد|baghdaad
basra|البصرة|il-basra
mosul|الموصل|il-mawsil
erbil|اربيل|arbeel
najaf|النجف|in-najaf
karbala|كربلاء|karbalaa
sulaymaniyah|السليمانية|is-sulaymaaniyya
kirkuk|كركوك|kirkook
america/usa/united states|امريكا|amreeka
britain/england/uk/united kingdom|بريطانيا|briitaanya
canada|كندا|kanada
germany|المانيا|almaanya
france|فرنسا|faransa
turkey|تركيا|turkiya
iran|ايران|eeraan
jordan|الاردن|il-urdun
kuwait|الكويت|il-kuwait
syria|سوريا|sooriya
egypt|مصر|misir
water|ماي|maay
tea|چاي|chaay
coffee|قهوة|gahwa
milk|حليب|7aleeb
juice|عصير|3aseer
bread|خبز|khubiz
samoon bread|صمون|samoon
rice|تمن|timman
meat|لحم|la7am
chicken|دجاج|dijaaj
fish|سمچ|simach
masgouf|مسگوف|masgoof
vegetables|خضرة|khudra
fruit|فواكه|fawaakih
apple|تفاح|tuffaa7
orange|برتقال|burtugaal
banana|موز|mooz
dates|تمر|timir
tomato|طماطة|timaata
potato|بطاطا|bataata
onion|بصل|basal
egg/eggs|بيض|bayd
cheese|جبن|jibin
sugar|سكر|sukkar
salt|ملح|mil7
pepper|فلفل|filfil
soup|شوربة|shorba
salad|سلطة|salata
dessert|حلويات|7alawiyyaat
breakfast|فطور|futoor
lunch|غدا|ghada
dinner|عشا|3asha
ice|ثلج|thalij
food|اكل|akil
beverage|مشروب|mashroob
bill/check|حساب|7isaab
menu|منيو|menyu
glass|گلاص|glaas
cup|فنجان|finjaan
bottle|قنينة|ganniina
plate|صحن|sa7in
spoon|كاشوگة|kaashooga
fork|چنگال|changaal
knife|سچين|sikkiin
spicy|حار|7aar
sweet|حلو|7ilu
good/nice|زين/خوش|zain/khosh
bad|خايس|khaayis
big/large|كبير|kabeer
small|زغير|zghayyir
new|جديد|jdeed
old|گديم|gadeem
beautiful/pretty|حلو|7ilu
expensive|غالي|ghaali
cheap|رخيص|rikheeS
fast/quick|سريع|saree3
slow|بطيء|batee'
hot|حار|7aar
cold|بارد|baarid
easy|سهل|sahil
difficult/hard|صعب|sa3ib
open (adj)|مفتوح|maftoo7
closed|مسكر|msakkar
clean|نظيف|nidheef
dirty|وسخ|wiskh
full|مليان|malyaan
empty|فارغ|faarigh
hungry|جوعان|joo3aan
thirsty|عطشان|3atshaan
tired|تعبان|ta3baan
happy|مبسوط|mabsoot
sad/upset|زعلان|za3laan
busy|مشغول|mashghool
sick/ill|مريض|mareedh
ready|جاهز|jaahiz
free/available|فاضي|faadhi
tall/long|طويل|taweel
short|گصير|gaseer
same|نفس|nafs
different|مختلف|mukhtalif
other/another|ثاني|thaani
left|يسار|yasaar
right (direction)|يمين|yameen
straight|دغري|dughri
near/close|گريب|gareeb
far|بعيد|ba3eed
up/above|فوگ|foog
down/below|تحت|ta7at
inside|داخل|daakhil
outside|برا|barra
front/in front of|گدام|gdaam
behind|ورا|wara
next to/beside|يم|yamm
opposite|مقابل|muqaabil
between|بين|bayn
first|اول|awwal
last|اخر|aakhir
next|الجاي|ij-jaay
man|رجال|rijjaal
woman|مرة|mara
boy/son|ولد|walad
girl/daughter|بنت|bint
child|طفل|tifil
children|جهال|juhhaal
people|ناس|naas
friend|صديق/صاحب|sadeeq/saa7ib
father|ابو|abu
mother|ام|umm
brother|اخو|akhu
sister|اخت|ukht
husband|زوج|zawj
wife|زوجة|zawja
family|عائلة/اهل|3aa'ila/ahl
mister/sir|استاذ|ustaadh
doctor|دكتور|doktoor
teacher|مدرس/معلم|mudarris/mu3allim
engineer|مهندس|muhandis
student|طالب|taalib
driver|سايق|saayiq
tourist|سائح|saa'i7
guest|ضيف|dheef
dear/darling|حبيبي/عيني|7abeebi/3ayni
phone/mobile|موبايل/تلفون|mobaayil/telefoon
passport|جواز|jawaaz
ticket|تذكرة|tathkira
money|فلوس|fuloos
dinar|دينار|deenaar
dollar|دولار|dolaar
cash|كاش|kaash
card|كارت|kaart
price|سعر|si3ir
key|مفتاح|miftaa7
door|باب|baab
window|شباك|shubbaak
car|سيارة|sayyaara
taxi|تكسي|taksi
bus|باص|baas
plane|طيارة|tayyaara
train|قطار|qitaar
luggage/bag/suitcase|چنطة/شنطة|chanta/shanta
clothes|هدوم|hduum
shoes|جزمة|jizma
medicine|دواء|dawa
pain|وجع|waja3
head|راس|raas
stomach|بطن|batin
eye|عين|3ayn
hand|ايد|eed
leg|رجل|rijil
tooth|سن|sinn
blood|دم|dam
bed|سرير|sireer
book|كتاب|kitaab
name|اسم|ism
number|رقم|raqm
email|ايميل|eemeel
password|باسورد|baasword
wifi/wi fi|واي فاي|waay faay
internet|انترنت|internet
charger|شاحن|shaa7in
map|خريطة|khareeta
address|عنوان|3unwaan
location|موقع|mawgi3
place|مكان|makaan
problem|مشكلة|mushkila
question|سؤال|su'aal
answer|جواب|jawaab
help|مساعدة|musaa3ada
weather|جو|jaw
sun|شمس|shams
rain|مطر|matar
must/have to/need to|لازم|laazim
iraqi|عراقي|3iraagi
arabic|عربي|3arabi
english|إنگليزي|ingleezi
kurdish|كردي|kurdi
american|امريكي|amreeki
mohammed/muhammad|محمد|mu7ammad
ahmed/ahmad|احمد|a7mad
ali|علي|3ali
omar|عمر|3umar
hassan|حسن|7asan
hussein/hussain|حسين|7usayn
fatima|فاطمة|faatima
zainab|زينب|zaynab
mustafa|مصطفى|mustafa
ibrahim|ابراهيم|ibraaheem
yousef/youssef/joseph|يوسف|yoosif
sara/sarah|سارة|saara
mary/maryam|مريم|maryam
noor|نور|noor
layla|ليلى|layla
khalid|خالد|khaalid
karim|كريم|kareem
sami|سامي|saami
john|جون|joon
michael|مايكل|maaykil
david|ديفيد|deefid
james|جيمس|jaymz
v:want|اريد|areed
v:go|اروح|arooh
v:come|اجي|aji
v:eat|آكل|aakul
v:drink|اشرب|ashrab
v:see|اشوف|ashoof
v:hear|اسمع|asma3
v:speak/talk|احچي|ahchi
v:say|اگول|agool
v:know|ادري|adri
v:understand|افتهم|aftihim
v:buy|اشتري|ashtiri
v:sell|ابيع|abee3
v:pay|ادفع|adfa3
v:take|آخذ|aakhuth
v:give|اعطي|a3ti
v:bring|اجيب|ajeeb
v:do/make|اسوي|asawwi
v:return/come back|ارجع|arja3
v:sleep|انام|anaam
v:work|اشتغل|ashtaghil
v:help (verb)|اساعد|asaa3id
v:need|احتاج|a7taaj
v:love/like|احب|a7ibb
v:book/reserve|احجز|a7jiz
v:call|اتصل|attasil
v:sit|اگعد|agu3ud
v:visit|ازور|azoor
v:learn|اتعلم|ata3allam
v:study|ادرس|adris
v:ask|اسأل|as'al
v:open|افتح|aftah
v:close|اسكر|asakkir
v:stop|اوگف|awgaf
v:wait|انتظر|antathir
v:find|الگي|algi
v:look for/search|ادور|adawwir
v:send|ارسل|arsil
v:write|اكتب|aktib
v:read|اگرا|agra
v:walk|امشي|amshi
v:live|اسكن|askun
v:stay|ابقى|abga
v:leave|اطلع|atla3
v:arrive|اوصل|awsal
v:start|ابدي|abdi
v:finish|اخلص|akhalliS
v:try|اجرب|ajarrib
v:forget|انسى|ansa
v:remember|اتذكر|atthakkar
v:think|افكر|afakkir
v:change/exchange|اغير|aghayyir
`;

const PATTERNS = `
>i want to *|اريد *|areed *
i want *|اريد *|areed *
i don't want *|ما اريد *|ma areed *
>i need to *|لازم *|laazim *
i have to *|لازم *|laazim *
i need *|احتاج *|a7taaj *
i don't need *|ما احتاج *|ma a7taaj *
can i have *|اگدر آخذ *؟|agdar aakhuth *?
can i *|اگدر *؟|agdar *?
i can *|اگدر *|agdar *
i like *|يعجبني *|y3ijibni *
i don't like *|ما يعجبني *|ma y3ijibni *
i love *|احب *|a7ibb *
i am from *|آني من *|ani min *
>i am a *|آني *|ani *
>i am an *|آني *|ani *
i am allergic to *|عندي حساسية من *|3indi 7asaasiyya min *
i am *|آني *|ani *
my name is *|اسمي *|ismi *
where is *|وين *؟|ween *?
>where are *|وين *؟|ween *?
where can i find *|وين اگدر الگي *؟|ween agdar algi *?
where can i buy *|وين اگدر اشتري *؟|ween agdar ashtiri *?
how much is *|بيش *؟|beesh *?
>how much are *|بيش *؟|beesh *?
how do i get to *|شلون اوصل ل *؟|shlon awsal li *?
take me to *|خذني ل *|khuthni li *
do you have *|عندك *؟|3indak *?
is there any *|اكو *؟|aku *?
>is there *|اكو *؟|aku *?
>is there a *|اكو *؟|aku *?
>there is no *|ماكو *|maku *
what is *|شنو *؟|shinu *?
who is *|منو *؟|minu *?
i have *|عندي *|3indi *
>i have a *|عندي *|3indi *
give me *|اعطيني *|a3tini *
bring me *|جيبلي *|jeebli *
thank you for *|شكراً على *|shukran 3ala *
>i would like to *|اريد *|areed *
>i would like *|اريد *|areed *
>can i get *|اگدر آخذ *؟|agdar aakhuth *?
>could i have *|اگدر آخذ *؟|agdar aakhuth *?
i am looking for *|ادور على *|adawwir 3ala *
do you speak *|تحچي *؟|tihchi *?
i don't have *|ما عندي *|ma 3indi *
this is *|هذا *|haatha *
very *|كلش *|kullish *
how many *|شكد *؟|shgad *?
`;

const REPLIES = `
how are you?=>i'm fine, thank god;and you?
hello=>hello;how are you?
peace be upon you=>and peace be upon you
welcome=>thank you
good morning=>good morning (reply)
good evening=>good evening (reply)
thank you=>you're welcome
thank you very much=>you're welcome
i'm sorry=>no problem
what's up?=>nothing new;i'm fine, thank god
do you speak english?=>yes;no;a little
would you like tea?=>yes, please;no, thank you
are you hungry?=>i'm hungry;no, thank you
do you need anything?=>no, thank you;water, please;i need help
can i help you?=>yes, please;no, thank you;please help me
is that all?=>that's all;more, please
do you accept cards?=>yes;no
is this halal?=>yes;no
is it spicy?=>not spicy please;more, please
nice to meet you=>nice to meet you
how is the family?=>i'm fine, thank god;thank god
where are you from?=>i am from iraq
`;

const QUICK = ["yes", "no", "thank you", "please speak slowly", "can you repeat that?", "i don't understand", "where is the bathroom?", "how much is this?"];
