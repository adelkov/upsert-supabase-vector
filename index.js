import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { createClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import 'dotenv/config'

const supabaseURL = process.env['SUPABASE_PROJECT_URL']
const supabaseKey = process.env['SUPABASE_ANON_KEY']
const supabaseClient = createClient(supabaseURL, supabaseKey)

const embedding = new OpenAIEmbeddings()

const vectorStore = new SupabaseVectorStore(embedding, {
  client: supabaseClient,
  table: 'documents',
})

const loader = new TextLoader('./about.txt')
const docs = await loader.load()
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  overlapSize: 30,
})
const chunks = await splitter.splitDocuments(docs)
await vectorStore.addDocuments(chunks)
