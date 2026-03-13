// Sample properties for demonstration
export const sampleProperties = [
  {
    id: 'sample-1',
    title: 'Modern Downtown Apartment',
    description: 'Stunning modern apartment in the heart of downtown with panoramic city views. Features include hardwood floors, stainless steel appliances, and floor-to-ceiling windows.',
    price: 3750000,
    location: 'New York, NY',
    type: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    sellerName: 'John Anderson',
    contact: 'seller@truehomes.com',
    mobile: '+1 (555) 123-4567',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    sellerId: 'demo-seller-1',
    sellerEmail: 'seller@truehomes.com',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    comments: [
      {
        id: 'comment-1',
        userId: 'user-1',
        userEmail: 'john@example.com',
        comment: 'This apartment looks amazing! Is it still available?',
        timestamp: new Date('2024-01-16T10:30:00').toISOString()
      },
      {
        id: 'comment-2',
        userId: 'user-2',
        userEmail: 'sarah@example.com',
        comment: 'Love the modern design and the city views are stunning!',
        timestamp: new Date('2024-01-17T14:20:00').toISOString()
      }
    ],
    ratings: [
      { userId: 'user-1', userEmail: 'john@example.com', rating: 5, timestamp: new Date('2024-01-16T10:30:00').toISOString() },
      { userId: 'user-2', userEmail: 'sarah@example.com', rating: 4, timestamp: new Date('2024-01-17T14:20:00').toISOString() },
      { userId: 'user-3', userEmail: 'mike@example.com', rating: 5, timestamp: new Date('2024-01-18T09:15:00').toISOString() }
    ]
  },
  {
    id: 'sample-2',
    title: 'Cozy Suburban House',
    description: 'Beautiful family home in a quiet neighborhood. Large backyard, updated kitchen, and close to excellent schools. Perfect for families looking for a peaceful environment.',
    price: 29000,
    location: 'Austin, TX',
    type: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    sellerName: 'Sarah Mitchell',
    contact: 'rentals@truehomes.com',
    mobile: '+1 (555) 234-5678',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    sellerId: 'demo-seller-2',
    sellerEmail: 'rentals@truehomes.com',
    createdAt: new Date('2024-01-14').toISOString(),
    updatedAt: new Date('2024-01-14').toISOString(),
    comments: [
      {
        id: 'comment-3',
        userId: 'user-3',
        userEmail: 'mike@example.com',
        comment: 'Perfect for families! The backyard is exactly what we need.',
        timestamp: new Date('2024-01-15T09:15:00').toISOString()
      }
    ],
    ratings: [
      { userId: 'user-3', userEmail: 'mike@example.com', rating: 5, timestamp: new Date('2024-01-15T09:15:00').toISOString() },
      { userId: 'user-4', userEmail: 'emma@example.com', rating: 4, timestamp: new Date('2024-01-16T11:20:00').toISOString() }
    ]
  },
  {
    id: 'sample-3',
    title: 'Luxury Penthouse Suite',
    description: 'Exclusive penthouse with breathtaking views, private terrace, and premium finishes throughout. Features include a gourmet kitchen, spa-like bathrooms, and smart home technology.',
    price: 10400000,
    location: 'San Francisco, CA',
    type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    sellerName: 'Michael Chen',
    contact: 'luxury@truehomes.com',
    mobile: '+1 (555) 345-6789',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    sellerId: 'demo-seller-3',
    sellerEmail: 'luxury@truehomes.com',
    createdAt: new Date('2024-01-13').toISOString(),
    updatedAt: new Date('2024-01-13').toISOString(),
    comments: [
      {
        id: 'comment-4',
        userId: 'user-4',
        userEmail: 'emma@example.com',
        comment: 'Absolutely luxurious! The smart home features are incredible.',
        timestamp: new Date('2024-01-14T16:45:00').toISOString()
      },
      {
        id: 'comment-5',
        userId: 'user-5',
        userEmail: 'david@example.com',
        comment: 'The terrace with city views is breathtaking. Worth every penny!',
        timestamp: new Date('2024-01-15T11:30:00').toISOString()
      }
    ],
    ratings: [
      { userId: 'user-4', userEmail: 'emma@example.com', rating: 5, timestamp: new Date('2024-01-14T16:45:00').toISOString() },
      { userId: 'user-5', userEmail: 'david@example.com', rating: 5, timestamp: new Date('2024-01-15T11:30:00').toISOString() },
      { userId: 'user-6', userEmail: 'alex@example.com', rating: 4, timestamp: new Date('2024-01-16T13:10:00').toISOString() }
    ]
  },
  {
    id: 'sample-4',
    title: 'Beachfront Condo',
    description: 'Wake up to ocean views every day! This stunning beachfront condo offers direct beach access, modern amenities, and a resort-style pool. Perfect vacation home or investment property.',
    price: 23000,
    location: 'Miami, FL',
    type: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    sellerName: 'Emily Rodriguez',
    contact: 'beach@truehomes.com',
    mobile: '+1 (555) 456-7890',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    sellerId: 'demo-seller-4',
    sellerEmail: 'beach@truehomes.com',
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
    comments: [
      {
        id: 'comment-6',
        userId: 'user-6',
        userEmail: 'alex@example.com',
        comment: 'Dream location! Waking up to ocean views would be amazing.',
        timestamp: new Date('2024-01-13T08:20:00').toISOString()
      }
    ],
    ratings: [
      { userId: 'user-6', userEmail: 'alex@example.com', rating: 5, timestamp: new Date('2024-01-13T08:20:00').toISOString() },
      { userId: 'user-7', userEmail: 'robert@example.com', rating: 5, timestamp: new Date('2024-01-14T10:30:00').toISOString() }
    ]
  },
  {
    id: 'sample-5',
    title: 'Historic Brownstone',
    description: 'Charming historic brownstone with original details preserved. High ceilings, ornate moldings, and a private garden. Located in a prestigious neighborhood with tree-lined streets.',
    price: 7300000,
    location: 'Boston, MA',
    type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    sellerName: 'Robert Thompson',
    contact: 'historic@truehomes.com',
    mobile: '+1 (555) 567-8901',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    sellerId: 'demo-seller-5',
    sellerEmail: 'historic@truehomes.com',
    createdAt: new Date('2024-01-11').toISOString(),
    updatedAt: new Date('2024-01-11').toISOString(),
    comments: [
      {
        id: 'comment-7',
        userId: 'user-7',
        userEmail: 'robert@example.com',
        comment: 'Love the historic charm! The original details are beautiful.',
        timestamp: new Date('2024-01-12T13:10:00').toISOString()
      }
    ],
    ratings: [
      { userId: 'user-7', userEmail: 'robert@example.com', rating: 4, timestamp: new Date('2024-01-12T13:10:00').toISOString() },
      { userId: 'user-8', userEmail: 'jennifer@example.com', rating: 5, timestamp: new Date('2024-01-13T15:40:00').toISOString() }
    ]
  },
  {
    id: 'sample-6',
    title: 'Mountain View Cabin',
    description: 'Rustic yet modern cabin with spectacular mountain views. Features include a stone fireplace, vaulted ceilings, and a large deck perfect for entertaining. Ideal mountain retreat.',
    price: 35000,
    location: 'Denver, CO',
    type: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    sellerName: 'Jennifer Williams',
    contact: 'mountain@truehomes.com',
    mobile: '+1 (555) 678-9012',
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1365&q=80'
    ],
    sellerId: 'demo-seller-6',
    sellerEmail: 'mountain@truehomes.com',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
    comments: [
      {
        id: 'comment-8',
        userId: 'user-8',
        userEmail: 'jennifer@example.com',
        comment: 'Perfect mountain getaway! The views are spectacular.',
        timestamp: new Date('2024-01-11T15:40:00').toISOString()
      },
      {
        id: 'comment-9',
        userId: 'user-9',
        userEmail: 'chris@example.com',
        comment: 'Great for family vacations. The deck is perfect for entertaining!',
        timestamp: new Date('2024-01-12T10:25:00').toISOString()
      }
    ],
    ratings: [
      { userId: 'user-8', userEmail: 'jennifer@example.com', rating: 5, timestamp: new Date('2024-01-11T15:40:00').toISOString() },
      { userId: 'user-9', userEmail: 'chris@example.com', rating: 4, timestamp: new Date('2024-01-12T10:25:00').toISOString() },
      { userId: 'user-1', userEmail: 'john@example.com', rating: 5, timestamp: new Date('2024-01-13T09:15:00').toISOString() }
    ]
  }
];

export const initializeSampleData = () => {
  // Check if properties already exist
  const existingProperties = localStorage.getItem('properties');
  
  if (!existingProperties || JSON.parse(existingProperties).length === 0) {
    // Initialize with sample data
    localStorage.setItem('properties', JSON.stringify(sampleProperties));
    console.log('Initialized with sample properties data');
  } else {
    console.log('Properties already exist, skipping initialization');
  }
};