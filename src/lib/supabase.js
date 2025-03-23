import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure to set your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const auth = {
  // Sign up a new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in an existing user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out the current user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get the current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get the current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Update user data
  updateUser: async (userData) => {
    const { data, error } = await supabase.auth.updateUser({
      data: userData
    });
    return { data, error };
  }
};

// Database query helpers based on your schema
export const db = {
  // Cars
  cars: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    getAvailable: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    create: async (carData) => {
      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select();
      return { data, error };
    },
    
    update: async (id, carData) => {
      const { data, error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', id)
        .select();
      return { data, error };
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  // Bookings
  bookings: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles(first_name, last_name),
          cars(make, model, image_url)
        `)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles(first_name, last_name),
          cars(make, model, image_url)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    getByUser: async (userId) => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars(make, model, image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    create: async (bookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();
      return { data, error };
    },
    
    update: async (id, bookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select();
      return { data, error };
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  // Profiles
  profiles: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    create: async (profileData) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select();
      return { data, error };
    },
    
    update: async (id, profileData) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id)
        .select();
      return { data, error };
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  // Reviews
  reviews: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(first_name, last_name),
          cars(make, model),
          bookings(start_date, end_date)
        `)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(first_name, last_name),
          cars(make, model),
          bookings(start_date, end_date)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    getByUser: async (userId) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          cars(make, model),
          bookings(start_date, end_date)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getByBooking: async (bookingId) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(first_name, last_name),
          cars(make, model)
        `)
        .eq('booking_id', bookingId)
        .single();
      return { data, error };
    },
    
    getByCar: async (carId) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(first_name, last_name),
          bookings(start_date, end_date)
        `)
        .eq('car_id', carId)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    create: async (reviewData) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select();
      return { data, error };
    },
    
    update: async (id, reviewData) => {
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', id)
        .select();
      return { data, error };
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      return { error };
    }
  }
};

export default supabase;