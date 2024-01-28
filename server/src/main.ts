import { supabase } from '@server/lib/supabaseClient';
import cors from 'cors';
import express from 'express';


const app = express();

const serverURL = new URL(
  import.meta.env.SERVER_URL ?? 'http://localhost:3001',
	)

const PORT = parseInt(serverURL.port) ?? 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON parsing for all routes

// Define your API routes here
app.get('/api', async (_req, res) => {

  const { data } = await supabase.from('countries').select()
  console.log(data)
  // Example route handler
   res.status(200).send('Hello from the server side!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});