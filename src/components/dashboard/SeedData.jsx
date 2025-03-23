// Components/dashboard/SeedData.jsx
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function SeedData() {
  const seedDatabase = async () => {
    try {
      // Example cars
      const cars = [
        { make: 'Toyota', model: 'Camry', year: 2022, daily_rate: 50, is_available: true },
        { make: 'Honda', model: 'Civic', year: 2023, daily_rate: 45, is_available: true },
        // Add more sample cars
      ];
      
      // Insert cars
      const { error: carsError } = await supabase.from('cars').insert(cars);
      if (carsError) throw carsError;
      
      toast.success('Sample data added successfully!');
      
      // Force refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to add sample data');
    }
  };
  
  return (
    <div className="p-4 border rounded-lg mb-6">
      <h3 className="font-medium mb-2">No data found</h3>
      <p className="text-muted-foreground mb-4">
        Your database appears to be empty. Would you like to add some sample data to get started?
      </p>
      <Button onClick={seedDatabase}>Add Sample Data</Button>
    </div>
  );
}