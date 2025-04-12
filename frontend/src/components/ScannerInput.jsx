
import { useState, useEffect, useRef } from 'react';
import { ScanLine, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

const ScannerInput = ({ onScan, isVerifying, isProcessing }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef(null);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle manual roll number input
  const handleInputChange = (e) => {
    setRollNumber(e.target.value);
  };

  // Handle scan submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!rollNumber.trim()) {
      toast.error("Please enter a valid roll number");
      return;
    }
    
    onScan(rollNumber.trim());
    setRollNumber('');
    
    // Re-focus the input after submission
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Toggle scanning mode
  const toggleScanning = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      toast("Scanner activated", {
        description: "Ready to receive barcode input",
      });
    } else {
      toast("Scanner deactivated");
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Student Check-in</h2>
        <p className="text-sm text-gray-500">Scan barcode or enter roll number</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isProcessing || isVerifying ? (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter roll number"
            value={rollNumber}
            onChange={handleInputChange}
            className={`pl-10 ${isScanning ? 'border-mess-primary border-2' : ''}`}
            disabled={isProcessing || isVerifying}
            autoComplete="off"
          />
          
          {isScanning && (
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-mess-primary opacity-50 animate-scanning"></div>
          )}
        </div>
        
        <div className="flex items-center mt-4 justify-between">
          <Button 
            type="button"
            variant={isScanning ? "default" : "outline"}
            onClick={toggleScanning}
            className={`flex items-center gap-2 ${isScanning ? 'bg-mess-primary text-white' : ''}`}
            disabled={isProcessing || isVerifying}
          >
            <ScanLine size={16} />
            {isScanning ? "Scanning Active" : "Activate Scanner"}
          </Button>
          
          <Button 
            type="submit"
            disabled={!rollNumber.trim() || isProcessing || isVerifying}
          >
            Check In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScannerInput;
