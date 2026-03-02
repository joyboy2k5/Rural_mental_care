const fs = require('fs');
const filepath = 'src/pages/patient/PatientResources.tsx';
let data = fs.readFileSync(filepath, 'utf8');

const replacement = `  {
    id: 'womens-health-anxieties',
    category: "Women's Mental Health",
    type: 'article',
    durationOrReadTime: '12 min read',
    tag: {
      en: 'STIGMA',
      te: 'అపోహలు',
      hi: 'कलंक (STIGMA)'
    },
    title: {
      en: 'Health-related Anxieties: Removing the Stigma of Seeking Help',
      te: 'ఆరోగ్యపరమైన ఆందోళనలు: మహిళల మానసిక ఆరోగ్యంపై ఉన్న అపోహలను చెరిపేయడం',
      hi: 'स्वास्थ्य से जुड़ी घबराहट: महिलाओं की मानसिक मदद से जुड़ी शर्म और कलंक को मिटाना'
    },
    description: {
      en: 'Breaking the silence around women’s physical and mental health struggles and the cultural shame of seeking help.',
      te: 'మహిళలు తమ శారీరక, మానసిక ఆరోగ్య సమస్యల గురించి మాట్లాడటానికి ఎందుకు సిగ్గుపడతారు? ఆ అపోహలను ఎలా బద్దలు కొట్టాలి.',
      hi: 'महिलाओं की शारीरिक और मानसिक बीमारियों पर छाई खामोशी को तोड़ना और मदद मांगने की शर्म को खत्म करना।'
    },
    content: {
      en: \`To the woman who was taught to suffer in absolute silence...

In our society, women are conditioned from a very young age to believe that pain is simply a part of womanhood. Whether it is severe menstrual cramps, the physical trauma of childbirth, the exhaustion of raising a family, or the emotional rollercoaster of menopause, you are repeatedly told: "This is a woman's lot. You must endure it silently." 

Because of this toxic conditioning, when a woman experiences severe physical pain or crushing mental anxiety, she hides it. She worries that if she complains, the household will stop functioning. She worries that she will be seen as a "weak" wife or a "bad" mother. And when she finally gathers the courage to express her deep mental and physical exhaustion, she is often met with the most damaging response of all: "It is all in your head," or "You are just being hormonal."

If you are suffering right now—whether from the terrifying sadness of postpartum depression, the severe anxiety of reproductive health issues, or the sheer mental burnout of putting everyone else's health before your own—this guide is here to validate your reality. It is time to break the profound stigma surrounding women's health.

1. The Normalization of Women's Pain
Society has deeply normalized women's suffering. When a man gets a fever, the whole house tiptoes around him so he can rest. When a woman gets a fever, she simply takes a pill and goes into the kitchen to cook for the family. 
You have been trained to ignore your body's distress signals. You push through back pain, joint pain, and profound mental exhaustion because "the family needs you." But ignoring pain does not make it disappear; it stores it in your nervous system. Your chronic anxiety, chest tightness, and sleepless nights are your body screaming for the care you refuse to give it. Acknowledging that your pain is real, and that it requires a doctor or a counselor, is not a failure of your duties. It is a biological necessity.

2. The Deep Shame Around "Women's Issues"
There is a massive wall of silence and shame built around women's reproductive health. Conditions like PCOS, severe uterine bleeding, miscarriages, infertility, or the onset of menopause are treated as dirty secrets that should not be discussed, even with your own husband. 
Because you are forced to deal with these terrifying bodily changes in complete isolation, the mental anxiety that follows is immense. You suffer from severe panic attacks and depression in the dark. Please understand this: Your body's reproductive system is just biology. It is not a measure of your worth, your purity, or your "completeness" as a woman. Seeking a gynecologist or a therapist to help you navigate this physical and mental trauma is your fundamental right.

3. The "Hysteria" Label: Why Women's Mental Health is Dismissed
When a woman expresses deep sadness, rage, or anxiety, society is very quick to gaslight her. Instead of asking, "What is causing her so much pain?", people ask, "Why is she acting so crazy?" 
Your legitimate mental health struggles are constantly dismissed as you being "too sensitive," "too emotional," or "just hormonal." This label of "madness" terrifies women into staying silent. You are not crazy. If your mind is breaking under the weight of endless domestic labor, invisible stress, and a lack of support, your depression is a completely logical response to an overwhelming situation. Do not let society's cruel labels stop you from speaking to a mental health professional.

4. Postpartum Depression: The Silent Thief of Motherhood
If you have recently had a baby and you feel an overwhelming sense of sadness, fear, or a complete lack of connection to your child, you are facing one of the heaviest stigmas in a woman's life: Postpartum Depression (PPD). 
Society demands that a new mother must be instantly glowing, joyful, and eternally grateful. When you tell someone you are crying every day, they say, "You should be happy you have a beautiful baby! Stop being ungrateful." 
This is incredibly dangerous. PPD is caused by a massive, violent drop in hormones after birth, combined with severe sleep deprivation and physical trauma. It is a medical condition, not a measure of how much you love your child. Seeking a counselor and a doctor for postpartum depression makes you a profoundly good, responsible mother who is actively fighting to get healthy for her baby.

5. Your Healing is Not Selfish
The biggest barrier to a woman seeking mental or physical help is the guilt of spending family money and time on herself. You think, "I should save this money for my children's future." 
But you cannot pour water from a shattered pot. If your physical and mental health completely collapses, who will be there for your family? Taking the time and resources to speak to a ManoVaidya counselor, to visit a doctor, and to rest is the exact opposite of being selfish. It is the foundation of your family's survival. 

A Final Thought
You have spent your entire life caring for others, nurturing them, and sacrificing your own comfort for their smiles. It is time to turn some of that fierce, protective love inward. Your mind and your body belong to you first. Seeking help is an act of immense bravery. Step out of the shadows of stigma, and take that step today.\`,

      te: \`నొప్పులను నిశ్శబ్దంగా భరించడమే ఆడజన్మ అని నమ్మిన ఒక మహిళకు...

మన సమాజంలో ఆడపిల్లలకు చిన్నప్పటి నుంచే ఒక విషయాన్ని నూరిపోస్తారు: "నొప్పులు, కష్టాలు భరించడం ఆడదాని జీవితంలో ఒక భాగం." అది భయంకరమైన నెలసరి (ప్రాణసంకటమైన పీరియడ్స్) నొప్పులైనా, బిడ్డను కనేటప్పుడు పడే నరకమైనా, కుటుంబాన్ని పోషించడంలో వచ్చే అలసట అయినా, లేదా మెనోపాజ్ (రుతుక్రమం ఆగిపోయే దశ) సమయంలో వచ్చే మానసిక ఒడిదుడుకులైనా... మీకు పదే పదే వినిపించే మాట ఒకటే: "ఆడజన్మ అన్నాక ఇవన్నీ తప్పవు, నోరు మూసుకుని భరించాలి."

ఈ తప్పుడు శిక్షణ వల్లే, ఒక మహిళకు భరించలేని శారీరక నొప్పి లేదా తీవ్రమైన మానసిక ఆందోళన (Anxiety) కలిగినప్పుడు, ఆమె దాన్ని దాచేస్తుంది. తాను నోరువిప్పి ఫిర్యాదు చేస్తే, ఇంటి పనులు ఆగిపోతాయని భయపడుతుంది. అందరూ తనను ఒక "బలహీనమైన" భార్యగా లేదా "చెడ్డ" తల్లిగా చూస్తారేమో అని భయపడుతుంది. అన్ని భయాలను పక్కనపెట్టి, తన శారీరక, మానసిక అలసట గురించి ధైర్యంగా ఇంట్లో చెప్పినప్పుడు, ఆమెకు ఎదురయ్యే అత్యంత దారుణమైన సమాధానం: "నీకు పని చేయడం ఇష్టం లేక ఈ నాటకాలు ఆడుతున్నావు" అనో, లేదా "నీకు మరీ చాదస్తం/పిచ్చి ఎక్కువైపోతోంది" అనో అంటారు.

మీరు బాలింత సమయంలో వచ్చే తీవ్రమైన కుంగుబాటుతో (Postpartum depression) బాధపడుతున్నా, లేదా మహిళల ఆరోగ్య సమస్యల వల్ల కలిగే ఆందోళనతో ఒంటరిగా ఏడుస్తున్నా... దయచేసి ఒక్క క్షణం ఆగండి. మీ ఆ అంతులేని మానసిక వేదనకు ఒక అర్థం ఉందని చెప్పడానికి, మహిళల ఆరోగ్యంపై ఉన్న ఈ విషపూరితమైన అపోహలను (Stigma) బద్దలు కొట్టడానికే ఈ సుదీర్ఘమైన వ్యాసం.

1. ఆడదాని నొప్పిని "మామూలే కదా" అని కొట్టిపారేయడం
సమాజం ఆడవాళ్ళ కష్టాన్ని చాలా తేలికగా తీసుకుంటుంది. ఇంట్లో మగవాడికి జ్వరం వస్తే, అతను విశ్రాంతి తీసుకోవాలని ఇల్లంతా నిశ్శబ్దంగా మారుతుంది. అదే ఒక మహిళకు జ్వరం వస్తే, ఆమె ఒక మాత్ర వేసుకుని వంటగదిలోకి వెళ్లి కుటుంబం కోసం వంట చేస్తుంది.
మీ శరీరం ఇచ్చే ప్రమాద హెచ్చరికలను పట్టించుకోకుండా ఉండటం మీకు అలవాటైపోయింది. "కుటుంబానికి నేను కావాలి" అని నడుము నొప్పిని, కీళ్ల నొప్పులను, మానసిక అలసటను పంటికింద బిగబట్టి పనిచేస్తారు. కానీ నొప్పిని దాచేసినంత మాత్రాన అది మాయం కాదు; అది మీ నాడీ వ్యవస్థలో పేరుకుపోతుంది. మీలో పెరుగుతున్న ఆందోళన, ఛాతీలో పట్టేసినట్లు ఉండటం, నిద్రలేమి... ఇవన్నీ మీ శరీరం "నన్ను కాపాడు" అని చేస్తున్న ఆర్తనాదాలు. మీ నొప్పి నిజమైనదని, దానికి డాక్టర్ లేదా కౌన్సెలర్ అవసరం ఉందని గుర్తించడం మీ కుటుంబ బాధ్యతలను విస్మరించడం కాదు. అది మీ ప్రాణాన్ని నిలబెట్టుకునే కనీస అవసరం.

2. "ఆడవాళ్ల సమస్యల" చుట్టూ ఉన్న భయంకరమైన సిగ్గు
మహిళల పునరుత్పత్తి (Reproductive health) ఆరోగ్య సమస్యల చుట్టూ ఒక పెద్ద నిశ్శబ్దపు గోడ కట్టబడింది. పీసీఓడీ (PCOD), గర్భాశయ సమస్యలు, అధిక రక్తస్రావం, గర్భస్రావాలు (Miscarriages), సంతానలేమి, లేదా మెనోపాజ్ లాంటివి అత్యంత రహస్యంగా దాచాల్సిన విషయాలుగా, కనీసం భర్తతో కూడా చెప్పుకోకూడని "సిగ్గుచేటు" విషయాలుగా పరిగణించబడతాయి.
శరీరంలో జరుగుతున్న ఈ భయంకరమైన మార్పులను మీరు ఒంటరిగా ఎదుర్కోవాల్సి రావడం వల్ల, మీలో విపరీతమైన ఆందోళన పుడుతుంది. చీకట్లో పానిక్ అటాక్స్ (Panic attacks), డిప్రెషన్తో పోరాడుతారు. దయచేసి ఇది అర్థం చేసుకోండి: మీ పునరుత్పత్తి వ్యవస్థ అనేది కేవలం జీవశాస్త్రం. అది మీ విలువకు, మీ పవిత్రతకు లేదా ఒక మహిళగా మీ "సంపూర్ణతకు" కొలమానం కాదు. ఈ శారీరక, మానసిక వేదన నుండి బయటపడటానికి ఒక గైనకాలజిస్ట్ను లేదా ఒక సైకాలజిస్ట్ను కలవడం అనేది మీ ప్రాథమిక హక్కు.

3. "పిచ్చిది" అనే ముద్ర: మహిళల మానసిక ఆరోగ్యాన్ని ఎందుకు నిర్లక్ష్యం చేస్తారు?
ఒక మహిళ తీవ్రమైన బాధను, కోపాన్ని లేదా ఆందోళనను వ్యక్తపరిచినప్పుడు, సమాజం వెంటనే ఆమెను తప్పుబడుతుంది. "ఆమెను ఏ బాధ అంతగా కుంగదీస్తోంది?" అని అడగడానికి బదులు, "దీనికెప్పుడూ ఇంతే, పిచ్చిపిచ్చిగా ప్రవర్తిస్తుంది" అని అంటారు.
మీ నిజమైన మానసిక వేదనను "మరీ సెన్సిటివ్", "ఎక్కువ ఎమోషనల్ అవుతుంది" అని కొట్టిపారేస్తారు. ఈ "పిచ్చిది" అనే ముద్ర పడుతుందనే భయంతో లక్షలాది మంది మహిళలు తమ డిప్రెషన్ను బయటకు చెప్పరు. మీకు పిచ్చి లేదు. అంతులేని ఇంటి పనుల భారం, కంటికి కనిపించని ఒత్తిడి, మరియు ఎవరి మద్దతు లేకపోవడం వల్ల మీ మనసు విరిగిపోతుంటే... మీ డిప్రెషన్ అనేది ఆ భయంకరమైన వాతావరణానికి మీ మెదడు ఇస్తున్న చాలా సహజమైన ప్రతిచర్య. సమాజం వేసే ఈ క్రూరమైన ముద్రలకు భయపడి మానసిక సహాయం (కౌన్సెలింగ్) తీసుకోవడం ఆపకండి.

4. పోస్ట్పార్టమ్ డిప్రెషన్ (బాలింత కుంగుబాటు): మాతృత్వాన్ని దొంగిలించే చీకటి
మీరు ఇటీవల ఒక బిడ్డకు జన్మనిచ్చి, ఆ బిడ్డతో ఎలాంటి బంధం కలగకుండా తీవ్రమైన బాధ, భయం, లేదా శూన్యతను అనుభవిస్తున్నట్లయితే... మీరు మహిళా జీవితంలోనే అత్యంత దారుణమైన అపోహతో పోరాడుతున్నారని అర్థం. దాన్నే పోస్ట్పార్టమ్ డిప్రెషన్ (PPD) అంటారు.
ఒక తల్లి ఎప్పుడూ తన బిడ్డను చూసుకుంటూ పరమానందంతో వెలిగిపోవాలని సమాజం డిమాండ్ చేస్తుంది. "నేను రోజూ ఏడుస్తున్నాను, నాకు భయంగా ఉంది" అని మీరు ఎవరికైనా చెబితే, "పండంటి బిడ్డ పుట్టినందుకు సంతోషించాల్సింది పోయి, ఇలా ఏడుస్తావేంటి? నీకు కృతజ్ఞత లేదు" అని విమర్శిస్తారు.
ఇది చాలా ప్రమాదకరమైన మాట. బిడ్డ పుట్టిన తర్వాత శరీరంలో హార్మోన్లు అమాంతం పడిపోవడం, నిద్ర లేకపోవడం, శారీరక గాయాల వల్ల ఈ పీపీడీ (PPD) వస్తుంది. ఇదొక మెడికల్ కండిషన్. అంతేగానీ, "మీరు మీ బిడ్డను ఎంతగా ప్రేమిస్తున్నారు" అనడానికి ఇది కొలమానం కాదు. ఈ కుంగుబాటు నుండి బయటపడటానికి కౌన్సెలర్ను లేదా డాక్టర్ను కలవడం ద్వారా... మీరు మీ బిడ్డ కోసం ఆరోగ్యంగా మారాలని పోరాడుతున్న ఒక అద్భుతమైన, బాధ్యతాయుతమైన తల్లిగా నిలబడతారు.

5. మిమ్మల్ని మీరు బాగుచేసుకోవడం స్వార్థం కాదు
మహిళలు వైద్య సహాయం లేదా మానసిక సహాయం తీసుకోకపోవడానికి అతిపెద్ద అడ్డంకి... తన కోసం కుటుంబం డబ్బు మరియు సమయాన్ని ఖర్చు చేయాల్సి వస్తుందేమో అన్న అపరాధ భావం (Guilt). "ఈ డబ్బు నా మందులకు వాడే బదులు పిల్లల చదువుల కోసం దాచాలి" అని మీరు అనుకుంటారు.
కానీ పగిలిపోయిన కుండ నుంచి మీరు నీళ్లు పోయలేరు కదా! మీ శారీరక, మానసిక ఆరోగ్యం పూర్తిగా కుప్పకూలిపోతే, మీ కుటుంబానికి ఎవరు అండగా ఉంటారు? మీకోసం సమయం తీసుకుని, మనోవైద్య (ManoVaidya) కౌన్సెలర్తో మాట్లాడటం, డాక్టర్ను కలవడం, విశ్రాంతి తీసుకోవడం అనేది స్వార్థం ఎంతమాత్రం కాదు. అది మీ కుటుంబ మనుగడకు అత్యంత పునాది.

ఒక ముగింపు మాట
మీ జీవితమంతా ఇతరుల కోసం శ్రమిస్తూ, వారి సంతోషం కోసం మీ సౌకర్యాలను త్యాగం చేస్తూనే గడిపారు. ఇతరుల పట్ల మీరు చూపే ఆ అపారమైన ప్రేమను, ఇప్పుడు కాస్త మీ వైపు కూడా మళ్లించుకునే సమయం వచ్చింది. మీ మనసు, మీ శరీరం ముందుగా మీకు చెందినవి. సహాయం అడగడం అంటే భయపడటం కాదు, అది అత్యంత గొప్ప ధైర్యం. అపోహల నీడల నుండి బయటకు రండి, ఈరోజే ఆ ధైర్యమైన అడుగు వేయండి.\`,

      hi: \`खामोशी से अपना दर्द सहने के लिए मजबूर की गई हर उस औरत को...

हमारे समाज में, लड़कियों को बचपन से ही यह सिखाया जाता है कि दर्द सहना औरत होने का ही एक हिस्सा है। चाहे वह माहवारी (Periods) का भयंकर दर्द हो, बच्चे को जन्म देने की शारीरिक पीड़ा हो, घर-परिवार सँभालने की अंतहीन थकावट हो, या मीनोपॉज़ (Menopause) के दौरान होने वाली भावनात्मक उथल-पुथल... आपको बार-बार यही सुनने को मिलता है: "औरत का जनम है तो ये सब झेलना ही पड़ेगा। खामोशी से बर्दाश्त करो।"

बचपन से मिली इस ज़हरीली सीख के कारण, जब एक औरत भयानक शारीरिक दर्द या जानलेवा दिमागी घबराहट (Anxiety) से गुज़रती है, तो वह उसे छुपा लेती है। वह डरती है कि अगर उसने शिकायत की, तो घर के काम रुक जाएंगे। वह डरती है कि लोग उसे एक "कमज़ोर" पत्नी या "बुरी" माँ समझेंगे। और जब वह सारी हिम्मत जुटाकर अपनी गहरी मानसिक और शारीरिक थकावट को ज़ाहिर करती है, तो उसे सबसे खतरनाक और दर्दनाक जवाब मिलता है: "ये सब तुम्हारे दिमाग का वहम है," या "तुम्हारे बस हॉर्मोन खराब हैं, कामचोरी के बहाने मत बनाओ।"

अगर आप इस वक्त तड़प रही हैं—चाहे वह बच्चे के जन्म के बाद होने वाली जानलेवा उदासी (Postpartum Depression) हो, महिलाओं की बीमारियों से जुड़ा डर हो, या दूसरों की सेहत को खुद से ऊपर रखने की वजह से दिमागी रूप से पूरी तरह टूट जाना हो—तो यह विस्तृत गाइड आपकी उस पीड़ा को मान्यता देने के लिए है। अब वक्त आ गया है कि महिलाओं के स्वास्थ्य से जुड़े इस कलंक (Stigma) को हमेशा के लिए मिटा दिया जाए।

1. औरतों के दर्द को "मामूली" समझना
समाज ने औरतों की पीड़ा को पूरी तरह से "नॉर्मल" मान लिया है। जब घर के आदमी को बुखार आता है, तो पूरा घर शांत हो जाता है ताकि वह आराम कर सके। जब एक औरत को बुखार आता है, तो वह बस एक गोली खाती है और परिवार के लिए खाना बनाने रसोई में चली जाती है।
आपको अपने शरीर के दर्द की चेतावनियों को नज़रअंदाज़ करने की ट्रेनिंग दी गई है। "परिवार को मेरी ज़रूरत है" यह सोचकर आप कमर दर्द, जोड़ों के दर्द और भयंकर मानसिक थकावट को नज़रअंदाज़ करते हुए काम करती रहती हैं। लेकिन दर्द को छुपाने से वह गायब नहीं होता; वह आपके नर्वस सिस्टम (नसों) में जमा हो जाता है। आपकी लगातार घबराहट, सीने में भारीपन, और रातों की नींद उड़ जाना... आपके शरीर की वह चीख है जो उस देखभाल की भीख मांग रही है जो आप उसे नहीं दे रहीं। यह मानना कि आपका दर्द असली है और आपको किसी डॉक्टर या काउंसलर की ज़रूरत है, आपकी ज़िम्मेदारियों से भागना नहीं है। यह ज़िंदा रहने की एक जैविक (biological) ज़रूरत है।

2. "औरतों की बीमारियों" से जुड़ी गहरी शर्म
हमारे समाज में महिलाओं के प्रजनन स्वास्थ्य (Reproductive health) के चारों ओर खामोशी और शर्म की एक बहुत बड़ी और मोटी दीवार खड़ी कर दी गई है। PCOD, गर्भाशय (Uterus) की समस्याएँ, भारी ब्लीडिंग, गर्भपात (Miscarriages), बांझपन, या मीनोपॉज़ की शुरुआत को ऐसे गंदे राज़ की तरह देखा जाता है जिसके बारे में पति से भी बात करना "बेशर्मी" माना जाता है।
चूंकि आपको इन डरावने शारीरिक बदलावों का अकेले, अंधेरे में सामना करने के लिए मजबूर किया जाता है, इसलिए इनसे पैदा होने वाली मानसिक घबराहट (Anxiety) बहुत भयानक होती है। आप अकेले रोती हैं और पैनिक अटैक (Panic Attacks) का सामना करती हैं। कृपया इस बात को गहराई से समझें: आपका प्रजनन तंत्र सिर्फ एक शरीर का हिस्सा (biology) है। यह आपकी कीमत, आपकी पवित्रता, या एक औरत के रूप में आपके "पूरे होने" का पैमाना नहीं है। इस शारीरिक और मानसिक आघात (Trauma) से उबरने के लिए किसी स्त्री रोग विशेषज्ञ (Gynecologist) या थेरेपिस्ट के पास जाना आपका बुनियादी और जन्मसिद्ध अधिकार है।

3. "पागल" का ठप्पा: महिलाओं के मानसिक स्वास्थ्य को क्यों नकारा जाता है?
जब एक औरत अपनी गहरी उदासी, अपना गुस्सा, या घबराहट ज़ाहिर करती है, तो समाज तुरंत उसे ही झूठा साबित करने में लग जाता है। लोग यह पूछने के बजाय कि "आखिर किस वजह से इसे इतना दर्द हो रहा है?", यह पूछने लगते हैं कि "ये पागलों की तरह क्यों बर्ताव कर रही है?"
आपके असली मानसिक संघर्षों को लगातार यह कहकर खारिज कर दिया जाता है कि आप "बहुत भावुक" हैं, "ज़्यादा सोचती हैं," या "ये बस हॉर्मोनल है।" "पागलपन" का यह ठप्पा औरतों को इस कदर डरा देता है कि वे हमेशा के लिए खामोश हो जाती हैं। आप पागल नहीं हैं। अगर अंतहीन घरेलू मज़दूरी, बिना किसी सहारे के अकेले सब सँभालने के अदृश्य तनाव के बोझ तले आपका दिमाग टूट रहा है, तो आपका डिप्रेशन इस अमानवीय स्थिति के प्रति आपके शरीर की बिल्कुल सही और तार्किक (logical) प्रतिक्रिया है। समाज के इन क्रूर और झूठे ठप्पों को खुद को मानसिक मदद मांगने से रोकने न दें।

4. बच्चे के जन्म के बाद का अवसाद (Postpartum Depression): मातृत्व का खामोश चोर
अगर आपने हाल ही में एक बच्चे को जन्म दिया है और आप अचानक गहरी उदासी, बेबसी, डर या अपने ही बच्चे से कोई जुड़ाव (Connection) महसूस नहीं कर पा रही हैं, तो आप एक औरत के जीवन के सबसे भारी कलंक (Stigma) का सामना कर रही हैं: पोस्टपार्टम डिप्रेशन (PPD)।
समाज यह मांग करता है कि एक नई माँ को हमेशा चमकते रहना चाहिए, बेहद खुश होना चाहिए और हमेशा आभारी होना चाहिए। जब आप किसी को बताती हैं कि आप हर दिन रो रही हैं, तो वे कहते हैं, "तुम्हारे पास इतना प्यारा बच्चा है, तुम्हें तो खुश होना चाहिए! ऐसी नाशुकर मत बनो।"
यह सोच बहुत खतरनाक है। PPD बच्चे के जन्म के बाद शरीर में हॉर्मोन के अचानक और तेज़ी से गिरने, कई दिनों तक नींद न पूरी होने और शारीरिक आघात के कारण होता है। यह एक मेडिकल बीमारी है, न कि इस बात का पैमाना कि आप अपने बच्चे से कितना प्यार करती हैं। इस उदासी के लिए किसी काउंसलर या डॉक्टर से मदद मांगना आपको एक बहुत ही बेहतरीन और ज़िम्मेदार माँ बनाता है, जो अपने बच्चे के लिए खुद को स्वस्थ करने की सक्रिय लड़ाई लड़ रही है।

5. खुद को ठीक करना आपका "स्वार्थ" नहीं है
एक औरत को मानसिक या शारीरिक मदद मांगने से रोकने वाली सबसे बड़ी दीवार वह आत्मग्लानि (Guilt) है कि वह परिवार का पैसा और समय अपने ऊपर खर्च कर रही है। आप सोचती हैं, "मुझे यह पैसा बच्चों के भविष्य के लिए बचाना चाहिए।"
लेकिन आप टूटे हुए घड़े से पानी नहीं डाल सकतीं। अगर आपका शारीरिक और मानसिक स्वास्थ्य पूरी तरह से ढह जाएगा, तो आपके परिवार को कौन सँभालेगा? अपने लिए समय निकालना, मनोवैद्य (ManoVaidya) के किसी काउंसलर से बात करना, डॉक्टर के पास जाना और आराम करना... स्वार्थ का बिल्कुल उल्टा है। यह आपके परिवार के ज़िंदा और खुश रहने की सबसे बड़ी नींव है।

एक आखिरी बात
आपने अपनी पूरी ज़िंदगी दूसरों की देखभाल करने, उन्हें संवारने, और उनकी मुस्कान के लिए अपने आराम की बलि चढ़ाने में बिता दी है। अब वक्त आ गया है कि उस ताक़तवर, रक्षा करने वाले प्यार का कुछ हिस्सा खुद अपनी ओर मोड़ें। आपका दिमाग और आपका शरीर सबसे पहले आपका है। मदद मांगना डरपोक होना नहीं, बल्कि अपार बहादुरी का काम है। समाज की इस झूठी शर्म (Stigma) के अंधेरे से बाहर आएं, और आज ही वह बहादुरी भरा कदम उठाएं।\`
    }
  },
  { id: '22', category: "Women's Mental Health", title: { en: 'Women and Depression', te: 'మహిళలు మరియు కుంగుబాటు' }, type: 'audio', durationOrReadTime: '18 min', description: { en: 'Recognizing signs of postpartum depression in rural mothers.', te: 'గ్రామీణ తల్లులలో ప్రసవానంతర మాంద్యం సంకేతాలను గుర్తించడం.' }, tag: { en: 'Postpartum', te: 'ప్రసవానంతరం' } },`;

const targetString = `  { id: '22', category: "Women's Mental Health", title: { en: 'Women and Depression', te: 'మహిళలు మరియు కుంగుబాటు' }, type: 'audio', durationOrReadTime: '18 min', description: { en: 'Recognizing signs of postpartum depression in rural mothers.', te: 'గ్రామీణ తల్లులలో ప్రసవానంతర మాంద్యం సంకేతాలను గుర్తించడం.' }, tag: { en: 'Postpartum', te: 'ప్రసవానంతరం' } },`;

if (data.includes(targetString)) {
    data = data.replace(targetString, replacement);
    fs.writeFileSync(filepath, data, 'utf8');
    console.log("Successfully replaced the text!");
} else {
    console.log("Could not find the target string!");
}
