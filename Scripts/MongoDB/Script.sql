// Suppression des collections existantes pour éviter les erreurs
db.restaurants.drop()
db.menus.drop()
db.orders.drop()
db.reviews.drop()
db.customer_profiles.drop()
db.driver_profiles.drop()
db.promotions.drop()

// Création des collections simples sans validation
db.createCollection("restaurants")
db.createCollection("menus")
db.createCollection("orders")
db.createCollection("reviews")
db.createCollection("customer_profiles")
db.createCollection("driver_profiles")
db.createCollection("promotions")

// Date actuelle pour la création des documents
const now = new Date()

// ---- Insertion de restaurants ----
const restaurants = [
  {
    name: "Le Bistrot Parisien",
    description: "Cuisine française traditionnelle dans un cadre élégant",
    location: {
      address: "15 rue de la Paix",
      city: "Paris",
      postal_code: "75002",
      country: "France",
      coordinates: [2.3364, 48.8666]
    },
    cuisine_types: ["française", "gastronomique", "traditionnelle"],
    phone: "+33123456789",
    website: "https://bistrotparisien.fr",
    hours: {
      monday: ["11:30-14:30", "19:00-22:30"],
      tuesday: ["11:30-14:30", "19:00-22:30"],
      wednesday: ["11:30-14:30", "19:00-22:30"],
      thursday: ["11:30-14:30", "19:00-22:30"],
      friday: ["11:30-14:30", "19:00-23:00"],
      saturday: ["11:30-15:00", "19:00-23:00"],
      sunday: ["12:00-15:00"]
    },
    owner_id: 101,
    status: "active",
    rating: 4.7,
    delivery_options: {
      delivery_fee: 3.99,
      min_order_amount: 15.00,
      estimated_delivery_time: 30
    },
    created_at: now,
    updated_at: now
  },
  {
    name: "Sushi Master",
    description: "Les meilleurs sushis préparés par des chefs japonais expérimentés",
    location: {
      address: "8 Avenue Montaigne",
      city: "Paris",
      postal_code: "75008",
      country: "France",
      coordinates: [2.3099, 48.8674]
    },
    cuisine_types: ["japonaise", "sushi", "asiatique"],
    phone: "+33198765432",
    website: "https://sushimaster.fr",
    hours: {
      monday: ["11:30-14:30", "18:30-22:00"],
      tuesday: ["11:30-14:30", "18:30-22:00"],
      wednesday: ["11:30-14:30", "18:30-22:00"],
      thursday: ["11:30-14:30", "18:30-22:00"],
      friday: ["11:30-14:30", "18:30-23:00"],
      saturday: ["12:00-15:00", "18:30-23:00"],
      sunday: ["18:30-22:00"]
    },
    owner_id: 102,
    status: "active",
    rating: 4.8,
    delivery_options: {
      delivery_fee: 4.50,
      min_order_amount: 20.00,
      estimated_delivery_time: 25
    },
    created_at: now,
    updated_at: now
  },
  {
    name: "Pizza Napoli",
    description: "Pizzas authentiques cuites au feu de bois",
    location: {
      address: "42 Rue des Lombards",
      city: "Paris",
      postal_code: "75004",
      country: "France",
      coordinates: [2.3481, 48.8599]
    },
    cuisine_types: ["italienne", "pizza", "méditerranéenne"],
    phone: "+33187654321",
    website: "https://pizzanapoli.fr",
    hours: {
      monday: ["11:30-14:30", "18:30-22:30"],
      tuesday: ["11:30-14:30", "18:30-22:30"],
      wednesday: ["11:30-14:30", "18:30-22:30"],
      thursday: ["11:30-14:30", "18:30-22:30"],
      friday: ["11:30-14:30", "18:30-23:30"],
      saturday: ["11:30-15:00", "18:30-23:30"],
      sunday: ["11:30-15:00", "18:30-22:30"]
    },
    owner_id: 103,
    status: "active",
    rating: 4.5,
    delivery_options: {
      delivery_fee: 2.99,
      min_order_amount: 15.00,
      estimated_delivery_time: 20
    },
    created_at: now,
    updated_at: now
  }
]

// Insertion des restaurants et récupération des IDs
const restaurantIds = []
restaurants.forEach(restaurant => {
  const result = db.restaurants.insertOne(restaurant)
  restaurantIds.push(result.insertedId)
})

print(`✅ ${restaurantIds.length} restaurants insérés`)

// ---- Insertion de menus ----
const menus = [
  {
    restaurant_id: restaurantIds[0], // Le Bistrot Parisien
    name: "Menu du Bistrot",
    description: "Notre sélection des meilleurs plats traditionnels français",
    active: true,
    availability: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      start_time: "11:30",
      end_time: "22:30"
    },
    items: [
      {
        name: "Escargots de Bourgogne",
        description: "Escargots cuisinés au beurre persillé",
        price: 12.50,
        image_url: "escargots.jpg",
        category: "Entrées",
        tags: ["spécialité", "traditionnel"],
        allergens: ["mollusques", "lait"],
        nutritional_info: {
          calories: 340,
          protein: 16,
          carbs: 2,
          fat: 30
        },
        available: true
      },
      {
        name: "Bœuf Bourguignon",
        description: "Ragoût de bœuf mijoté au vin rouge avec légumes et lardons",
        price: 18.90,
        image_url: "boeuf_bourguignon.jpg",
        category: "Plats principaux",
        tags: ["spécialité", "traditionnel"],
        allergens: ["lait", "céleri", "sulfites"],
        nutritional_info: {
          calories: 580,
          protein: 35,
          carbs: 12,
          fat: 42
        },
        options: [
          {
            name: "Accompagnement",
            choices: [
              { name: "Pommes de terre", price_adjustment: 0 },
              { name: "Purée maison", price_adjustment: 0 },
              { name: "Pâtes fraîches", price_adjustment: 1.50 }
            ],
            required: true,
            multiple_selection: false
          }
        ],
        available: true
      },
      {
        name: "Crème Brûlée",
        description: "Crème vanillée caramélisée",
        price: 7.50,
        image_url: "creme_brulee.jpg",
        category: "Desserts",
        tags: ["dessert", "traditionnel"],
        allergens: ["œufs", "lait"],
        nutritional_info: {
          calories: 320,
          protein: 5,
          carbs: 26,
          fat: 22
        },
        available: true
      }
    ],
    created_at: now,
    updated_at: now
  },
  {
    restaurant_id: restaurantIds[1], // Sushi Master
    name: "Menu Dégustation",
    description: "Notre sélection premium de sushis",
    active: true,
    availability: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      start_time: "11:30",
      end_time: "22:00"
    },
    items: [
      {
        name: "Edamame",
        description: "Fèves de soja japonaises cuites à la vapeur",
        price: 4.90,
        image_url: "edamame.jpg",
        category: "Entrées",
        tags: ["végétarien"],
        allergens: ["soja"],
        nutritional_info: {
          calories: 120,
          protein: 11,
          carbs: 10,
          fat: 5
        },
        available: true
      },
      {
        name: "Plateau Tokyo",
        description: "Assortiment de 16 pièces: nigiri, maki et california rolls",
        price: 24.90,
        image_url: "plateau_tokyo.jpg",
        category: "Plats principaux",
        tags: ["spécialité", "poisson cru"],
        allergens: ["poisson", "crustacés", "soja", "gluten", "sésame"],
        nutritional_info: {
          calories: 650,
          protein: 40,
          carbs: 80,
          fat: 18
        },
        options: [
          {
            name: "Wasabi",
            choices: [
              { name: "Normal", price_adjustment: 0 },
              { name: "Extra", price_adjustment: 0.50 },
              { name: "Sans", price_adjustment: 0 }
            ],
            required: true,
            multiple_selection: false
          }
        ],
        available: true
      },
      {
        name: "Mochi Glacé",
        description: "Pâtisserie japonaise à base de riz gluant fourré de glace",
        price: 6.50,
        image_url: "mochi.jpg",
        category: "Desserts",
        tags: ["dessert", "spécialité"],
        allergens: ["lait", "gluten"],
        nutritional_info: {
          calories: 180,
          protein: 2,
          carbs: 30,
          fat: 6
        },
        options: [
          {
            name: "Parfum",
            choices: [
              { name: "Thé vert", price_adjustment: 0 },
              { name: "Mangue", price_adjustment: 0 },
              { name: "Chocolat", price_adjustment: 0 },
              { name: "Vanille", price_adjustment: 0 }
            ],
            required: true,
            multiple_selection: false
          }
        ],
        available: true
      }
    ],
    created_at: now,
    updated_at: now
  },
  {
    restaurant_id: restaurantIds[2], // Pizza Napoli
    name: "Menu Pizzeria",
    description: "Nos pizzas traditionnelles italiennes",
    active: true,
    availability: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      start_time: "11:30",
      end_time: "23:30"
    },
    items: [
      {
        name: "Bruschetta",
        description: "Pain grillé à l'ail avec tomates fraîches, basilic et huile d'olive",
        price: 6.90,
        image_url: "bruschetta.jpg",
        category: "Entrées",
        tags: ["végétarien"],
        allergens: ["gluten"],
        nutritional_info: {
          calories: 220,
          protein: 5,
          carbs: 26,
          fat: 12
        },
        available: true
      },
      {
        name: "Pizza Margherita",
        description: "La classique: sauce tomate, mozzarella, basilic frais",
        price: 10.90,
        image_url: "margherita.jpg",
        category: "Pizzas",
        tags: ["végétarien", "classique"],
        allergens: ["gluten", "lait"],
        nutritional_info: {
          calories: 760,
          protein: 28,
          carbs: 90,
          fat: 32
        },
        options: [
          {
            name: "Taille",
            choices: [
              { name: "Normale (30cm)", price_adjustment: 0 },
              { name: "Grande (40cm)", price_adjustment: 4.00 }
            ],
            required: true,
            multiple_selection: false
          },
          {
            name: "Pâte",
            choices: [
              { name: "Classique", price_adjustment: 0 },
              { name: "Fine", price_adjustment: 0 },
              { name: "À bord farci", price_adjustment: 2.50 }
            ],
            required: true,
            multiple_selection: false
          }
        ],
        available: true
      },
      {
        name: "Tiramisu",
        description: "Le dessert italien par excellence: mascarpone, café, cacao",
        price: 6.50,
        image_url: "tiramisu.jpg",
        category: "Desserts",
        tags: ["dessert", "spécialité"],
        allergens: ["œufs", "lait", "gluten"],
        nutritional_info: {
          calories: 380,
          protein: 7,
          carbs: 40,
          fat: 22
        },
        available: true
      }
    ],
    created_at: now,
    updated_at: now
  }
]

// Insertion des menus
const menuIds = []
menus.forEach(menu => {
  const result = db.menus.insertOne(menu)
  menuIds.push(result.insertedId)
})

print(`✅ ${menuIds.length} menus insérés`)

// ---- Insertion de profils clients ----
const customerProfiles = [
  {
    user_id: 201,
    first_name: "Marie",
    last_name: "Dubois",
    profile_picture: "marie_profile.jpg",
    addresses: [
      {
        name: "Domicile",
        street: "24 Rue de Rivoli",
        city: "Paris",
        postal_code: "75004",
        country: "France",
        coordinates: [2.3508, 48.8563],
        is_default: true
      },
      {
        name: "Bureau",
        street: "15 Avenue des Champs-Élysées",
        city: "Paris",
        postal_code: "75008",
        country: "France",
        coordinates: [2.3081, 48.8698],
        is_default: false
      }
    ],
    payment_methods: [
      {
        provider: "Visa",
        last_four: "4242",
        expiry_date: "04/26",
        card_type: "credit",
        token: "tok_visa_4242",
        is_default: true
      }
    ],
    preferences: {
      favorite_cuisines: ["japonaise", "italienne"],
      dietary_restrictions: ["vegetarian_friendly"],
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    user_id: 202,
    first_name: "Thomas",
    last_name: "Martin",
    profile_picture: "thomas_profile.jpg",
    addresses: [
      {
        name: "Domicile",
        street: "8 Rue Montorgueil",
        city: "Paris",
        postal_code: "75002",
        country: "France",
        coordinates: [2.3466, 48.8651],
        is_default: true
      }
    ],
    payment_methods: [
      {
        provider: "Mastercard",
        last_four: "5555",
        expiry_date: "09/25",
        card_type: "debit",
        token: "tok_mastercard_5555",
        is_default: true
      }
    ],
    preferences: {
      favorite_cuisines: ["française", "asiatique"],
      dietary_restrictions: [],
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    user_id: 203,
    first_name: "Sophie",
    last_name: "Petit",
    profile_picture: "sophie_profile.jpg",
    addresses: [
      {
        name: "Domicile",
        street: "36 Boulevard Saint-Germain",
        city: "Paris",
        postal_code: "75005",
        country: "France",
        coordinates: [2.3413, 48.8515],
        is_default: true
      }
    ],
    payment_methods: [
      {
        provider: "American Express",
        last_four: "0005",
        expiry_date: "12/24",
        card_type: "credit",
        token: "tok_amex_0005",
        is_default: true
      }
    ],
    preferences: {
      favorite_cuisines: ["méditerranéenne", "française"],
      dietary_restrictions: ["gluten_free"],
      notifications: {
        email: true,
        push: false,
        sms: false
      }
    },
    created_at: now,
    updated_at: now
  }
]

// Insertion des profils clients
db.customer_profiles.insertMany(customerProfiles)
print(`✅ ${customerProfiles.length} profils clients insérés`)

// ---- Insertion de profils livreurs ----
const driverProfiles = [
  {
    user_id: 301,
    first_name: "Lucas",
    last_name: "Bernard",
    profile_picture: "lucas_profile.jpg",
    vehicle_type: "scooter",
    vehicle_details: {
      make: "Vespa",
      model: "Primavera",
      year: 2022,
      color: "Bleu",
      license_plate: "AB-123-CD"
    },
    license_number: "B123456789",
    insurance_info: "AXA Assurance #12345",
    status: "available",
    current_location: [2.3522, 48.8566],
    rating: 4.9,
    total_deliveries: 342,
    payment_details: {
      account_number: "FR76XXXXXXXXXXXXX",
      bank_name: "BNP Paribas",
      routing_number: "30004"
    },
    created_at: now,
    updated_at: now
  },
  {
    user_id: 302,
    first_name: "Emma",
    last_name: "Leroy",
    profile_picture: "emma_profile.jpg",
    vehicle_type: "vélo",
    vehicle_details: {
      make: "Decathlon",
      model: "Riverside",
      year: 2021,
      color: "Noir",
      license_plate: null
    },
    license_number: "B987654321",
    insurance_info: "MAIF Assurance #54321",
    status: "busy",
    current_location: [2.3608, 48.8502],
    rating: 4.7,
    total_deliveries: 156,
    payment_details: {
      account_number: "FR76XXXXXXXXXXXXX",
      bank_name: "Société Générale",
      routing_number: "30003"
    },
    created_at: now,
    updated_at: now
  }
]

// Insertion des profils livreurs
db.driver_profiles.insertMany(driverProfiles)
print(`✅ ${driverProfiles.length} profils livreurs insérés`)

// ---- Insertion de commandes ----
const orders = [
  {
    customer_id: 201, // Marie Dubois
    restaurant_id: restaurantIds[0], // Le Bistrot Parisien
    driver_id: 301, // Lucas Bernard
    items: [
      {
        menu_item_id: null,
        name: "Escargots de Bourgogne",
        price: 12.50,
        quantity: 1,
        special_instructions: ""
      },
      {
        menu_item_id: null,
        name: "Bœuf Bourguignon",
        price: 18.90,
        quantity: 2,
        special_instructions: "Cuisson bien cuite svp",
        selected_options: [
          {
            name: "Accompagnement",
            choices: ["Pommes de terre"],
            price_adjustment: 0
          }
        ]
      }
    ],
    subtotal: 50.30,
    tax: 5.03,
    delivery_fee: 3.99,
    tip: 5.00,
    total: 64.32,
    status: "delivered",
    payment_status: "completed",
    payment_method: "card",
    transaction_id: 1001,
    delivery_address: {
      street: "24 Rue de Rivoli",
      city: "Paris",
      postal_code: "75004",
      country: "France",
      coordinates: [2.3508, 48.8563],
      instructions: "Code: 1234"
    },
    estimated_delivery_time: new Date(now.getTime() - 60 * 60000), // 1h dans le passé
    actual_delivery_time: new Date(now.getTime() - 45 * 60000), // 45min dans le passé
    tracking: [
      {
        status: "confirmed",
        timestamp: new Date(now.getTime() - 120 * 60000), // 2h dans le passé
        note: "Commande confirmée par le restaurant"
      },
      {
        status: "preparing",
        timestamp: new Date(now.getTime() - 100 * 60000), // 1h40min dans le passé
        note: "Préparation de votre commande"
      },
      {
        status: "ready_for_pickup",
        timestamp: new Date(now.getTime() - 80 * 60000), // 1h20min dans le passé
        note: "Commande prête pour la livraison"
      },
      {
        status: "in_transit",
        timestamp: new Date(now.getTime() - 70 * 60000), // 1h10min dans le passé
        location: [2.3433, 48.8602],
        note: "Votre commande est en route"
      },
      {
        status: "delivered",
        timestamp: new Date(now.getTime() - 45 * 60000), // 45min dans le passé
        location: [2.3508, 48.8563],
        note: "Commande livrée avec succès"
      }
    ],
    created_at: new Date(now.getTime() - 120 * 60000), // 2h dans le passé
    updated_at: new Date(now.getTime() - 45 * 60000) // 45min dans le passé
  },
  {
    customer_id: 202, // Thomas Martin
    restaurant_id: restaurantIds[1], // Sushi Master
    driver_id: 302, // Emma Leroy
    items: [
      {
        menu_item_id: null,
        name: "Edamame",
        price: 4.90,
        quantity: 2,
        special_instructions: ""
      },
      {
        menu_item_id: null,
        name: "Plateau Tokyo",
        price: 24.90,
        quantity: 1,
        special_instructions: "",
        selected_options: [
          {
            name: "Wasabi",
            choices: ["Extra"],
            price_adjustment: 0.50
          }
        ]
      }
    ],
    subtotal: 35.20,
    tax: 3.52,
    delivery_fee: 4.50,
    tip: 3.50,
    total: 46.72,
    status: "in_transit",
    payment_status: "completed",
    payment_method: "card",
    transaction_id: 1002,
    delivery_address: {
      street: "8 Rue Montorgueil",
      city: "Paris",
      postal_code: "75002",
      country: "France",
      coordinates: [2.3466, 48.8651],
      instructions: "3ème étage"
    },
    estimated_delivery_time: new Date(now.getTime() + 15 * 60000), // 15min dans le futur
    actual_delivery_time: null,
    tracking: [
      {
        status: "confirmed",
        timestamp: new Date(now.getTime() - 30 * 60000), // 30min dans le passé
        note: "Commande confirmée par le restaurant"
      },
      {
        status: "preparing",
        timestamp: new Date(now.getTime() - 25 * 60000), // 25min dans le passé
        note: "Préparation de votre commande"
      },
      {
        status: "ready_for_pickup",
        timestamp: new Date(now.getTime() - 15 * 60000), // 15min dans le passé
        note: "Commande prête pour la livraison"
      },
      {
        status: "in_transit",
        timestamp: new Date(now.getTime() - 10 * 60000), // 10min dans le passé
        location: [2.3508, 48.8615],
        note: "Votre commande est en route"
      }
    ],
    created_at: new Date(now.getTime() - 30 * 60000), // 30min dans le passé
    updated_at: new Date(now.getTime() - 10 * 60000) // 10min dans le passé
  },
  {
    customer_id: 203, // Sophie Petit
    restaurant_id: restaurantIds[2], // Pizza Napoli
    driver_id: null,
    items: [
      {
        menu_item_id: null,
        name: "Pizza Margherita",
        price: 10.90,
        quantity: 1,
        special_instructions: "Bien cuite svp",
        selected_options: [
          {
            name: "Taille",
            choices: ["Normale (30cm)"],
            price_adjustment: 0
          },
          {
            name: "Pâte",
            choices: ["Fine"],
            price_adjustment: 0
          }
        ]
      },
      {
        menu_item_id: null,
        name: "Tiramisu",
        price: 6.50,
        quantity: 1,
        special_instructions: ""
      }
    ],
    subtotal: 17.40,
    tax: 1.74,
    delivery_fee: 2.99,
    tip: 2.00,
    total: 24.13,
    status: "pending",
    payment_status: "pending",
    payment_method: "card",
    transaction_id: null,
    delivery_address: {
      street: "36 Boulevard Saint-Germain",
      city: "Paris",
      postal_code: "75005",
      country: "France",
      coordinates: [2.3413, 48.8515],
      instructions: "Sonner à Petit"
    },
    estimated_delivery_time: new Date(now.getTime() + 45 * 60000), // 45min dans le futur
    actual_delivery_time: null,
    tracking: [
      {
        status: "pending",
        timestamp: now,
        location: null,
        note: "Commande reçue, en attente de confirmation"
      }
    ],
    created_at: now,
    updated_at: now
  }
]

// Insertion des commandes
const orderIds = []
orders.forEach(order => {
  const result = db.orders.insertOne(order)
  orderIds.push(result.insertedId)
})

print(`✅ ${orderIds.length} commandes insérées`)

// ---- Insertion des avis ----
const reviews = [
  {
    customer_id: 201, // Marie Dubois
    order_id: orderIds[0],
    restaurant_id: restaurantIds[0], // Le Bistrot Parisien
    driver_id: 301, // Lucas Bernard
    rating: 5,
    food_rating: 5,
    delivery_rating: 5,
    comment: "Excellente expérience ! Le bœuf bourguignon était parfait et le livreur très professionnel.",
    photos: ["review_photo1.jpg"],
    reply: {
      text: "Merci beaucoup pour votre retour, nous sommes ravis que vous ayez apprécié notre cuisine !",
      date: new Date(now.getTime() - 30 * 60000) // 30min dans le passé
    },
    created_at: new Date(now.getTime() - 40 * 60000), // 40min dans le passé
    updated_at: new Date(now.getTime() - 30 * 60000) // 30min dans le passé
  }
]

// Insertion des avis
db.reviews.insertMany(reviews)
print(`✅ ${reviews.length} avis insérés`)

// ---- Insertion des promotions ----
const promotions = [
  {
    code: "BIENVENUE10",
    description: "10% de réduction sur votre première commande",
    discount_type: "percentage",
    discount_value: 10,
    min_order_value: 15.00,
    max_discount: 20.00,
    restaurant_id: null,
    cuisine_types: [],
    usage_limit: 1000,
    usage_count: 456,
    start_date: new Date(now.getTime() - 30 * 24 * 60 * 60000), // 30 jours dans le passé
    end_date: new Date(now.getTime() + 60 * 24 * 60 * 60000), // 60 jours dans le futur
    active: true,
    first_time_only: true,
    created_at: new Date(now.getTime() - 30 * 24 * 60 * 60000), // 30 jours dans le passé
    updated_at: new Date(now.getTime() - 30 * 24 * 60 * 60000) // 30 jours dans le passé
  },
  {
    code: "PIZZANIGHT",
    description: "Livraison gratuite pour les pizzas le vendredi soir",
    discount_type: "free_delivery",
    discount_value: 0,
    min_order_value: 20.00,
    max_discount: null,
    restaurant_id: restaurantIds[2], // Pizza Napoli
    cuisine_types: ["pizza", "italienne"],
    usage_limit: 500,
    usage_count: 123,
    start_date: new Date(now.getTime() - 15 * 24 * 60 * 60000), // 15 jours dans le passé
    end_date: new Date(now.getTime() + 45 * 24 * 60 * 60000), // 45 jours dans le futur
    active: true,
    first_time_only: false,
    created_at: new Date(now.getTime() - 15 * 24 * 60 * 60000), // 15 jours dans le passé
    updated_at: new Date(now.getTime() - 15 * 24 * 60 * 60000) // 15 jours dans le passé
  },
  {
    code: "SUSHI15",
    description: "15€ de réduction pour les commandes de plus de 50€",
    discount_type: "fixed_amount",
    discount_value: 15,
    min_order_value: 50.00,
    max_discount: null,
    restaurant_id: restaurantIds[1], // Sushi Master
    cuisine_types: ["japonaise", "sushi", "asiatique"],
    usage_limit: 200,
    usage_count: 45,
    start_date: new Date(now.getTime() - 5 * 24 * 60 * 60000), // 5 jours dans le passé
    end_date: new Date(now.getTime() + 25 * 24 * 60 * 60000), // 25 jours dans le futur
    active: true,
    first_time_only: false,
    created_at: new Date(now.getTime() - 5 * 24 * 60 * 60000), // 5 jours dans le passé
    updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60000) // 5 jours dans le passé
  }
]

// Insertion des promotions
db.promotions.insertMany(promotions)
print(`✅ ${promotions.length} promotions insérées`)

// Création des index
// Restaurants
db.restaurants.createIndex({ "location.coordinates": "2dsphere" })
db.restaurants.createIndex({ "name": 1 })
db.restaurants.createIndex({ "cuisine_types": 1 })
db.restaurants.createIndex({ "owner_id": 1 })
db.restaurants.createIndex({ "status": 1 })
db.restaurants.createIndex({ "rating": -1 })

// Menus
db.menus.createIndex({ "restaurant_id": 1 })
db.menus.createIndex({ "items.name": "text", "items.description": "text" })
db.menus.createIndex({ "items.category": 1 })
db.menus.createIndex({ "items.tags": 1 })

// Commandes
db.orders.createIndex({ "customer_id": 1 })
db.orders.createIndex({ "restaurant_id": 1 })
db.orders.createIndex({ "driver_id": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "created_at": -1 })
db.orders.createIndex({ "delivery_address.coordinates": "2dsphere" })

// Avis
db.reviews.createIndex({ "restaurant_id": 1 })
db.reviews.createIndex({ "customer_id": 1 })
db.reviews.createIndex({ "order_id": 1 })
db.reviews.createIndex({ "driver_id": 1 })
db.reviews.createIndex({ "rating": -1 })

// Profils client
db.customer_profiles.createIndex({ "user_id": 1 }, { unique: true })
db.customer_profiles.createIndex({ "addresses.coordinates": "2dsphere" })

// Profils livreur
db.driver_profiles.createIndex({ "user_id": 1 }, { unique: true })
db.driver_profiles.createIndex({ "current_location": "2dsphere" })
db.driver_profiles.createIndex({ "status": 1 })

// Promotions
db.promotions.createIndex({ "code": 1 }, { unique: true })
db.promotions.createIndex({ "restaurant_id": 1 })
db.promotions.createIndex({ "start_date": 1, "end_date": 1 })
db.promotions.createIndex({ "active": 1 })

print("🎉 Toutes les collections, données d'exemple et index ont été créés avec succès !")