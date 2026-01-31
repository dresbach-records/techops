package main

// Simplified structures for demonstration. In a real app, these would be more detailed.

// WhatsAppWebhookPayload is the top-level structure for incoming webhooks from Meta.
type WhatsAppWebhookPayload struct {
	Object string  `json:"object"`
	Entry  []Entry `json:"entry"`
}

type Entry struct {
	ID      string   `json:"id"`
	Changes []Change `json:"changes"`
}

type Change struct {
	Value Value  `json:"value"`
	Field string `json:"field"`
}

type Value struct {
	MessagingProduct string    `json:"messaging_product"`
	Metadata         Metadata  `json:"metadata"`
	Messages         []Message `json:"messages"`
}

type Metadata struct {
	DisplayPhoneNumber string `json:"display_phone_number"`
	PhoneNumberID      string `json:"phone_number_id"`
}

type Message struct {
	From string `json:"from"`
	ID   string `json:"id"`
	Text struct {
		Body string `json:"body"`
	} `json:"text"`
	Type      string `json:"type"`
	Timestamp string `json:"timestamp"`
}

// WhatsAppAPIRequest is the structure for sending a message.
type WhatsAppAPIRequest struct {
	MessagingProduct string `json:"messaging_product"`
	To               string `json:"to"`
	Type             string `json:"type"`
	Text             struct {
		Body string `json:"body"`
	} `json:"text"`
}
