##nede.js##


import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const { data, error } = await supabase
  .from('todos')
  .select()


  ##deno ##

  import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'))

const { data, error } = await supabase
  .from('todos')
  .select()

  ##cdn##

  <script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

  const supabase = createClient(https://uywrnrfefmzsgbhewbdi.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d3JucmZlZm16c2diaGV3YmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDc0NDYsImV4cCI6MjA4MTU4MzQ0Nn0.kgO4ANhQhiJkDx53DfogR2pFeB_mY__ojBl3VU0ePyc)

  const { data, error } = await supabase
    .from('todos')
    .select()
</script>


##fetch##


const data = await fetch(`${process.env.SUPABASE_URL}/rest/v1/countries`, {
  headers: {
    'apikey': process.env.SUPABASE_ANON_KEY
  }
})
  .then(res => res.json())
  .catch(error => {
    // Handle error
  });

  ##http###
  https://uywrnrfefmzsgbhewbdi.supabase.co/rest/v1/todos?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d3JucmZlZm16c2diaGV3YmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDc0NDYsImV4cCI6MjA4MTU4MzQ0Nn0.kgO4ANhQhiJkDx53DfogR2pFeB_mY__ojBl3VU0ePyc

  ##cURL##

  curl 'https://uywrnrfefmzsgbhewbdi.supabase.co/rest/v1/todos' -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d3JucmZlZm16c2diaGV3YmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDc0NDYsImV4cCI6MjA4MTU4MzQ0Nn0.kgO4ANhQhiJkDx53DfogR2pFeB_mY__ojBl3VU0ePyc"