/* Real, hotlinked photos per place. Keyed by `pk`. {url, caption}.
   Wikimedia = hotlink-safe/CORS-friendly; business sites are official-CDN (lower permanence).
   Broken images hide gracefully (onerror) and fall back to an icon placeholder.

   TODO fotos pendientes (cada card de restaurante debería tener LUGAR + COMIDA):
   - Cards nuevas sin foto: classclown, ryuko, noblepie, gyukaku, lupo (lugar+comida);
     sidewalkcitizen, deville (desayuno); four20, prairierecords, originalgoods (fachada).
   - Cards que solo tienen LUGAR y les falta COMIDA: pigeonhole, caesars, majortom,
     alforno, philseb, rivercafe, whitebark, tavern1883, bridgette.
   - Card que solo tiene COMIDA y le falta LUGAR: oeb.
   No se pudieron sourcear aquí: el sandbox bloquea toda salida HTTPS (curl/WebFetch 403),
   así que no hay forma de buscar ni verificar URLs de imagen reales desde este entorno. */
window.PHOTOS = {
 /* ---------- Calgary ---------- */
 yyc:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Parked%20airplanes%20at%20Calgary%20International%20Airport%20(YYC).jpg?width=1000",caption:"Aviones en las puertas del aeropuerto de Calgary (YYC)"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Parked%20airplane%20connected%20to%20a%20jet%20bridge%20at%20Calgary%20International%20Airport%20(YYC).jpg?width=1000",caption:"Avión en YYC conectado a la pasarela"}
 ]},
 chinook:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary%20Alberta%20Phil%20and%20Sebastian%20Chinook%20Mall%20Coffee%20Roasters%20Small%20Latte%20Foam%20Art%20(5192261821).jpg?width=1000",caption:"Phil & Sebastian Coffee Roasters dentro de CF Chinook Centre"}
 ]},
 "17ave":{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Redmile3.JPG?width=1000",caption:"17th Avenue SW (la Red Mile), Calgary"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Redmile1.JPG?width=1000",caption:"La Red Mile, 17th Avenue SW"}
 ]},
 peacebridge:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Peace%20bridge%20by%20Santiago%20Calatrava%20(8393676268).jpg?width=1000",caption:"Peace Bridge de Santiago Calatrava, Calgary"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary%20peace%20bridge.jpg?width=1000",caption:"Peace Bridge sobre el río Bow"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/The%20peace%20bridge%20downtown%20Calgary%20Alberta%20over%20the%20Bow%20river.%20(10504579965).jpg?width=1000",caption:"Peace Bridge de noche, downtown Calgary"}
 ]},
 studiobell:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary's%20Studio%20Bell%20(48917195993).jpg?width=1000",caption:"Studio Bell, National Music Centre, East Village"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/National%20Music%20Centre%20(26135834041).jpg?width=1000",caption:"National Music Centre (Studio Bell)"}
 ]},
 kensington:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Sunnyside%20art%20supplies%20(14702688895).jpg?width=1000",caption:"Comercio en el barrio Kensington/Sunnyside, Calgary"}
 ]},
 inglewood:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/InglewoodCalgary.JPG?width=1000",caption:"9 Avenue SE, barrio Inglewood, Calgary"}
 ]},
 calgarytower:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary%20Tower%201.jpg?width=1000",caption:"Calgary Tower"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary%20Tower%20with%20flame%201.jpg?width=1000",caption:"Calgary Tower con la llama encendida"}
 ]},
 modernsteak:{photos:[
  {url:"https://img1.wsimg.com/isteam/ip/e1839b12-3fa8-47b0-9065-745519fe89c8/15.jpg/:/rs=w:1200",caption:"Corte prime de Alberta marmoleado en Modern Steak"}
 ]},
 pigeonhole:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/5fcadab8cb1c8a2efc380b58/1607445460184-6UHB3ACH14QYCPL2VR2W/IMG_4755-2.jpg?format=1500w",caption:"Barra de mármol de Pigeonhole, Calgary"},
  {url:"https://images.squarespace-cdn.com/content/v1/5fcadab8cb1c8a2efc380b58/1607445487809-6Y1Q37JZ6IFDB3N47JD4/PIGEONHOLE-8536.jpg?format=1500w",caption:"Comedor de Pigeonhole — ladrillo expuesto y sillas naranjas"}
 ]},
 oeb:{photos:[
  {url:"https://eatoeb.com/wp-content/uploads/2026/06/HP-ChickWaff.webp",caption:"Pollo frito con waffles y syrup, OEB"},
  {url:"https://eatoeb.com/wp-content/uploads/2026/06/HP-Pancakes.webp",caption:"Torre de pancakes con syrup"}
 ]},
 caesars:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/614a28fd437b323bbf2be0c5/507aa3df-dcf2-45f4-a7e4-5882e52e27e9/080A6084.JPG",caption:"Steak con hueso y vegetales salteados, Caesar's"},
  {url:"https://images.squarespace-cdn.com/content/v1/614a28fd437b323bbf2be0c5/1643650949361-WB8W5K8POIZEZP1BDNY7/CAESARS-26.jpg",caption:"Cóctel Caesar de la casa"}
 ]},
 fromanother:{photos:[
  {url:"https://cdn.shopify.com/s/files/1/0017/9680/0571/files/IMG_1457.jpg?v=1707253734",caption:"Fachada de From Another en 17th Ave"},
  {url:"https://cdn.shopify.com/s/files/1/0017/9680/0571/files/IMG_2089.jpg?v=1707255876",caption:"Adentro de From Another — vintage, gorras y sneakers"}
 ]},
 less17:{photos:[
  {url:"https://lessoneseven.com/cdn/shop/files/Store_FW21__25.jpg?v=1654540952&width=1800",caption:"Tienda LESS 17 en 930 17th Ave SW, Calgary"}
 ]},
 alforno:{photos:[
  {url:"https://alforno.ca/wp-content/uploads/2025/01/225A4135-scaled.jpg",caption:"Croissants recién horneados, Alforno"}
 ]},
 majortom:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/5e4c381520b2c302b4fa6c42/1640196029736-7KAQEF56PJGDZWOZLA8Z/image-asset.jpeg",caption:"Pescado sellado con tomates y ejotes, Major Tom"},
  {url:"https://images.squarespace-cdn.com/content/v1/5e4c381520b2c302b4fa6c42/667384fe-b7ba-4498-a930-7b84b876b1e9/download.jpg",caption:"T-bone con costra de sal"}
 ]},
 philseb:{photos:[
  {url:"https://philsebastian.com/cdn/shop/articles/new-milkshots-headline-new2-620x620.jpg",caption:"Latte con arte en Phil & Sebastian"},
  {url:"https://cdn.shopify.com/s/files/1/1821/9001/files/Espresso-and-Tonic-620x620_large.jpg",caption:"Espresso tonic sobre hielo"}
 ]},
 core:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Core_Shopping_Concourse_1.jpg?width=1000",caption:"Concourse de The CORE Shopping Centre, centro de Calgary"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Plus_15_sign_and_walkway_Calgary.jpg?width=1000",caption:"Pasarela y señal del +15, la red de puentes climatizados de Calgary"}
 ]},
 zoo:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary%20Zoo%20-%20Zoolights%20-%20Gift%20Shop.jpg?width=1000",caption:"ZooLights en el Calgary Zoo, de noche con nieve"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary%20Zoo%20Africa.jpg?width=1000",caption:"Pabellón del Calgary Zoo en un día de invierno"}
 ]},
 rivercafe:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/6408ba26cf0093126c3116f0/56cd5380-a404-423b-b569-57ecf81216fb/River-Cafe-Salmon-5912%28PhotobyPaulineYu%29.jpg?format=1500w",caption:"Salmón curado con caviar y pepino, River Café"},
  {url:"https://images.squarespace-cdn.com/content/v1/6408ba26cf0093126c3116f0/5797ad0c-23b3-4956-8bc2-05d6abece3eb/Banner-30thAnniShrimp.jpg",caption:"Crudo de camarón con rábano"}
 ]},
 fireworks:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/New%20Years%20in%20Calgary%20%282%29%20%2831872546722%29.jpg?width=1000",caption:"Fuegos de Año Nuevo sobre el centro de Calgary (Olympic Plaza)"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/New%20Years%20in%20Calgary%20%281%29%20%2832020491385%29.jpg?width=1000",caption:"Fuegos de fin de año iluminando el cielo de Calgary"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/New%20Years%20in%20Calgary%20%283%29%20%2831982279916%29.jpg?width=1000",caption:"Estallido dorado de fuegos sobre Calgary en una noche de invierno"}
 ]},
 princesisland:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Calgary%20AB%20Prince%27s-Island-Park%202022-09-28.jpg?width=1000",caption:"Prince's Island Park con el skyline de Calgary detrás"}
 ]},

 /* ---------- Calgary · restaurantes nuevos ----------
    FOTOS PENDIENTES: el sandbox bloquea toda salida HTTPS (no se pueden
    buscar ni verificar URLs de imagen). Cada card debe llevar 1 foto del
    LUGAR + 1 foto de la COMIDA. Mientras tanto cae al placeholder con ícono. */
 classclown:{photos:[]},
 ryuko:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/6165e48a19f0e07104746a1f/22450da7-f8a8-459f-bda0-613735da7d7a/ryuko-main-4.jpg",caption:"Set japonés: chirashi, ensalada y platillos, Ryuko"},
  {url:"https://images.squarespace-cdn.com/content/v1/6165e48a19f0e07104746a1f/21f16866-b7b7-495b-bffb-69c1b45b02c6/ryuko-main-23.jpg",caption:"Spread izakaya con sashimi y arroz"}
 ]},
 noblepie:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/671fe8d6ab2af759aa1282a4/8fbb1f2c-b410-4553-b036-631d94e7df16/NPWEB-13b.jpg",caption:"Slices estilo NY con vino natural, Noble Pie"},
  {url:"https://images.squarespace-cdn.com/content/v1/671fe8d6ab2af759aa1282a4/242fc73b-a309-453c-b6df-4218d129b258/food3.jpg?format=1500w",caption:"Slice de pepperoni en el counter"}
 ]},
 gyukaku:{photos:[]},
 sidewalkcitizen:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/64ef60fef135340c0d8c6d67/1777407749573-EE9QSWYGKKGFNEUV3KBJ/image-asset.jpeg",caption:"Pain au chocolat y croissants, Sidewalk Citizen"},
  {url:"https://images.squarespace-cdn.com/content/v1/64ef60fef135340c0d8c6d67/1779118215027-KHB6A2RVKVTKM8LQ5N13/image-asset.jpeg",caption:"Bowls de ensalada y quiche de brócoli"}
 ]},
 deville:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/5a7f5f104c0dbf05e2dad8b6/1677862690542-J1GCQSTIARRODS1U8DD3/deville-latte.jpg",caption:"Latte con arte, DEVILLE"},
  {url:"https://images.squarespace-cdn.com/content/v1/5a7f5f104c0dbf05e2dad8b6/1662397563371-IAWBV9FPX5L0ZTDREDVW/image-asset.jpeg",caption:"Bebidas frías de fruta en DEVILLE"}
 ]},

 /* ---------- Cannabis (zaza) · cerca del Airbnb del centro ----------
    FOTOS PENDIENTES (mismo bloqueo de red). Una foto de fachada/interior c/u. */
 four20:{photos:[]},
 prairierecords:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Palace_Theatre%2C_Calgary.jpg?width=1000",caption:"Prairie Records (cannabis) en el histórico Palace Theatre, Stephen Ave"}
 ]},
 originalgoods:{photos:[]},

 /* ---------- Banff ---------- */
 banfftown:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Banff_Townsite_%2815641698605%29.jpg?width=1000",caption:"Banff townsite nevado desde Sulphur Mountain"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Mist_Over_Banff_Avenue_%28Unsplash%29.jpg?width=1000",caption:"Banff Avenue con el Mt Cascade al fondo"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Town_of_banff.jpg?width=1000",caption:"Pueblo de Banff y el río Bow"}
 ]},
 banffgondola:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Banff_Gondola_Sulphur_Mountain_%2815800344652%29.jpg?width=1000",caption:"Banff Gondola subiendo Sulphur Mountain"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Banff_Sulphur_Mountain_Gondola_IMG_4259.JPG?width=1000",caption:"La góndola sobre Sulphur Mountain en invierno"}
 ]},
 hotsprings:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Upper_Hot_Springs_Banf_BNP_2529.JPG?width=1000",caption:"Piscina al aire libre del Banff Upper Hot Springs"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Banff_Upper_Hot_Springs.JPG?width=1000",caption:"Banff Upper Hot Springs en Sulphur Mountain"}
 ]},
 grizzlyhouse:{photos:[
  {url:"https://banfflakelouise.bynder.com/m/d5a0f49d97139ea/webimage-2022_GrizzlyHouse_AdventureCities_SamBurrows7.png",caption:"Fondue de queso en Grizzly House"}
 ]},
 minnewanka:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Minnewanka_01.jpg?width=1000",caption:"Lake Minnewanka en invierno"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Costigan%2C_frozen_Lake_Minnewanka.jpg?width=1000",caption:"Mount Costigan sobre el Lake Minnewanka congelado"}
 ]},
 twojack:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Rundle_as_seen_from_Two_Jack_Lake.jpg?width=1000",caption:"Mt Rundle desde Two Jack Lake"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Two_Jack_Lake_-_Banff.jpg?width=1000",caption:"Two Jack Lake al atardecer con el Mt Rundle"}
 ]},
 vermilion:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/DSC0015_Sunrise_Vermilion_Lake_Banff_National_Park%2C_AB_in_winter.jpg?width=1000",caption:"Amanecer invernal en Vermilion Lakes"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Vermilion_Lakes_2_-_Banff.jpg?width=1000",caption:"Vermilion Lakes con el Mt Rundle"}
 ]},
 johnston:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Frozen_Waterfall_-_Johnston_Canyon_Lower_Falls_%2816253131462%29.jpg?width=1000",caption:"Lower Falls congeladas en Johnston Canyon"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Ice_climbers_at_Johnston_Canyon_Banff_National_Park_Canada.jpg?width=1000",caption:"Escaladores de hielo en Johnston Canyon"}
 ]},
 surprisecorner:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Fairmont_Banff_Springs_Hotel_and_Bow_river%2C_north_view_20240821_1.jpg?width=1000",caption:"Fairmont Banff Springs sobre el río Bow — la vista de Surprise Corner"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Banff_Springs_Hotel_2017.jpg?width=1000",caption:"El 'castillo' Fairmont Banff Springs"}
 ]},
 norquay:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Bighorn_sheep_grazing_near_a_parking_lot_in_Banff_National_Park.jpg?width=1000",caption:"Borrego cimarrón en Banff National Park"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/View_from_Mount_Norquay%2C_Banff_National_Park_%2819417814543%29.jpg?width=1000",caption:"Vista del pueblo de Banff desde Mt Norquay"}
 ]},
 lakelouise:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Louise_in_Winter_2005-02-20.jpeg?width=1000",caption:"Lake Louise congelado con el Fairmont Chateau y el glaciar Victoria"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Louise_panorama_winter.jpg?width=1000",caption:"Panorama invernal de Lake Louise"}
 ]},
 whitebark:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/51f19c90e4b02252a1047e0c/1687551838573-WIK0J2L4ADZEFRUV20VN/285864079_750173089341598_5007738885230347924_n_18302546770025427.jpg",caption:"Cheesecake casero con coulis y latte, Whitebark"},
  {url:"https://images.squarespace-cdn.com/content/v1/51f19c90e4b02252a1047e0c/1687551971053-OYFO9XPZAPJ9S7G2PD80/325741474_671914851388723_1240858817595830674_n_18271936777110774.jpg",caption:"Carrot cake con frosting de queso crema"}
 ]},
 cows:{photos:[
  {url:"https://cows.ca/cdn/shop/files/29._strawberry_Mary_Beth_Malone.jpg",caption:"Helado de fresa en cono de waffle, COWS"},
  {url:"https://cows.ca/cdn/shop/files/1._birthdaycake.jpg",caption:"Helado Birthday Cake en cono con sprinkles"}
 ]},
 beavertails:{photos:[
  {url:"https://assets.beavertails.com/production/products/_500x900_fit_center-center_90_none_ns/4379/The_Classic_website.webp",caption:"BeaverTail clásica con azúcar y canela"},
  {url:"https://assets.beavertails.com/production/products/_500x900_fit_center-center_90_none_ns/4378/Pistachio_website.webp",caption:"BeaverTail de pistacho"}
 ]},
 monod:{photos:[
  {url:"https://www.monodsports.com/cdn/shop/files/2011_Monods_front.jpg",caption:"Monod Sports en 129 Banff Avenue, con el Mt Cascade detrás"}
 ]},
 sweetshoppe:{photos:[
  {url:"https://nebula.wsimg.com/683da8bf98d8c4a5c851a061bfc86ed4?AccessKeyId=9C87CC7BE7009CA42B55&disposition=0&alloworigin=1",caption:"Fudge casero en rebanadas, Banff Sweet Shoppe"},
  {url:"https://nebula.wsimg.com/ed5f0641a90105e60c052a12bbb0bea0?AccessKeyId=9C87CC7BE7009CA42B55&disposition=0&alloworigin=1",caption:"Surtido de dulces retro e importados"}
 ]},
 lupo:{photos:[
  {url:"https://cdn.prod.website-files.com/696e7eabc8af93f0a0d16799/69927b2f587062a3231179d4_Rigatoni-Mar%2B4-6919%2Bsm.avif",caption:"Rigatoni con stracciatella y albahaca, LUPO"},
  {url:"https://cdn.prod.website-files.com/696e7eabc8af93f0a0d16799/69927b2fa5c997ed80407f0d_Tag-Mar%2B11-25.avif",caption:"Tagliatelle fresca hecha en casa"}
 ]},

 /* ---------- Canmore / Kananaskis ---------- */
 canmore:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Canmore_-_panorama_from_Ha_Ling_Peak.jpg?width=1000",caption:"Canmore desde Ha Ling Peak, Bow Valley"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Three_Sister_Mountains%2C_Canmore%2C_Alberta.jpg?width=1000",caption:"Los picos Three Sisters sobre Canmore"}
 ]},
 threesisters:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Three_Sister_Mountains%2C_Canmore%2C_Alberta.jpg?width=1000",caption:"Los Three Sisters, Canmore"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Three_Sisters_-_Canmore_-_panoramio.jpg?width=1000",caption:"Three Sisters reflejados cerca de Canmore"}
 ]},
 wolfdog:{photos:[
  {url:"https://cdn.prod.website-files.com/6007167e74a8b24ad2b98eb9/600b237f6d9a4ec794bbe3fc_yamnuska-hero-image.jpg",caption:"Wolfdog en su recinto, Yamnuska Wolfdog Sanctuary"},
  {url:"https://cdn.prod.website-files.com/600ba493ff949381eb8aad81/60187e22ef7423445c056d8b_yamnuska-wolfdog-sanctuary-Wolfdogs-High-Content-Alpine.jpg",caption:"Wolfdog de alto contenido 'Alpine'"}
 ]},
 sleddog:{photos:[
  {url:"https://www.snowyowltours.com/wp-content/uploads/2024/05/VIC03526-Edit-2.jpg-1.jpeg",caption:"Trineo de perros con Snowy Owl, Kananaskis"},
  {url:"https://www.snowyowltours.com/wp-content/uploads/2024/05/Powder-Hound_resized.jpg",caption:"Equipo de perros de trineo de Snowy Owl"}
 ]},
 spraylakes:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Rocky_mountain_and_Spray_Lakes_Reservoir.jpg?width=1000",caption:"Spray Lakes Reservoir y las Rocosas"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/A_trip_down_spray_lakes_road_Alberta_Canada_%2816502277087%29.jpg?width=1000",caption:"Spray Lakes Road (Smith-Dorrien)"}
 ]},
 grotto:{photos:[
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Grotto_Canyon_day_hike_Canmore_Alberta_Canada_%2815802272033%29.jpg?width=1000",caption:"Caminata por el arroyo congelado de Grotto Canyon"},
  {url:"https://commons.wikimedia.org/wiki/Special:FilePath/Grotto_Canyon_Hike_%2831512771983%29.jpg?width=1000",caption:"Grotto Canyon, Canmore"}
 ]},
 nordicspa:{photos:[
  {url:"https://knordicspa.com/wp-content/uploads/2026/02/Hot-Pools-731x1024.jpg",caption:"Pozas calientes al aire libre, Kananaskis Nordic Spa"},
  {url:"https://knordicspa.com/wp-content/uploads/2025/07/Cold-Plunge.jpg",caption:"Plunge frío, Kananaskis Nordic Spa"}
 ]},
 tavern1883:{photos:[
  {url:"https://tavern1883.com/wp-content/uploads/2020/08/Tavern-1883-Burger-Chicken-scaled.jpg",caption:"Hamburguesa con papas hechas a mano, Tavern 1883"}
 ]},
 crazyweed:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/61f46c4aa6b23d4e7511790b/0e0910d7-55cd-4b93-a840-5a03cc4bea8a/BrandingPhotos-68.jpg",caption:"Mesa de Crazyweed: pizza al horno, olivas y flatbread"},
  {url:"https://images.squarespace-cdn.com/content/v1/61f46c4aa6b23d4e7511790b/cf84f36c-6224-4fc2-bc21-c4a0f49a0270/BrandingPhotos-50.jpg",caption:"Plato de Crazyweed con chips y vino"}
 ]},
 jkbakery:{photos:[
  {url:"https://jkbakery.ca/cdn/shop/files/Cinnamon_Bun.png",caption:"Cinnamon bun glaseado, JK Bakery"},
  {url:"https://cdn.shopify.com/s/files/1/3102/8808/files/WholeSwissRhubarbCake.webp",caption:"Swiss rhubarb cake de JK Bakery"}
 ]},
 communitea:{photos:[
  {url:"https://www.thecommunitea.com/uploads/2/6/3/7/26373291/dishes-3_1.png",caption:"Avocado toast con salmón y ensalada, Communitea"},
  {url:"https://www.thecommunitea.com/uploads/2/6/3/7/26373291/communitea-cm-buddha_1_orig.jpg",caption:"Buddha bowl en Communitea"}
 ]},
 bankhead:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/653a7308f17d61648ba3cffb/f235247a-d42a-4be6-be7c-b1284f5466cd/Elk+Osso+Buco-1080-700.jpg",caption:"Elk osso buco del Bankhead"},
  {url:"https://images.squarespace-cdn.com/content/v1/653a7308f17d61648ba3cffb/6389aaec-79ee-4fe3-b2b0-5e50e9f94753/shashuka+egg+benedict.jpg",caption:"Eggs benedict estilo shakshuka"}
 ]},
 bridgette:{photos:[
  {url:"https://images.squarespace-cdn.com/content/v1/65298e5c82d0557c8e0573c2/1730483500548-U7DK151UHX3DM8CQ0OA6/image-asset.jpeg",caption:"Burrata con pan a la parrilla, Bridgette Bar"},
  {url:"https://images.squarespace-cdn.com/content/v1/65298e5c82d0557c8e0573c2/1732295880989-ACD6QHOKIGG6OC8X38AX/image-asset.jpeg",caption:"Cheesecake de merengue tostado, Bridgette Bar"}
 ]},
 quarry:{photos:[]}
};
