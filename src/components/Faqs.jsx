import React, { useState } from "react";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const railwayReservationFaqs = [
    {
      id: 1,
      question: "How do I book a train ticket online?",
      answer:
        "To book a train ticket online, visit our website or mobile app, log in to your account, select the journey details, choose the train, and follow the steps to complete the reservation.",
    },
    {
      id: 2,
      question:
        "What information do I need to provide during the reservation process?",
      answer:
        "You'll need to provide details such as the departure and arrival stations, travel date, class of travel, and the number of passengers. Make sure to have valid identification for each passenger.",
    },
    {
      id: 3,
      question: "Can I modify or cancel my reservation?",
      answer:
        "Yes, you can modify or cancel your reservation online through your account. However, there may be modification or cancellation fees depending on the time of the request and ticket type.",
    },
    {
      id: 4,
      question: "How can I check the train schedule and seat availability?",
      answer:
        "You can check the train schedule and seat availability on our website or mobile app. Enter your journey details, and the system will display available trains with their schedules and seat availability.",
    },
    {
      id: 5,
      question: "What types of classes are available for reservation?",
      answer:
        "We offer various classes such as Sleeper Class, AC Class, and more. The availability depends on the specific train. Choose the class that best suits your preferences and budget.",
    },
    {
      id: 6,
      question: "Is it possible to get a refund for a canceled ticket?",
      answer:
        "Refunds for canceled tickets are subject to our refund policy. Generally, a refund is provided after deducting cancellation charges. Refer to our refund policy for more details.",
    },
    {
      id: 7,
      question: "How do I collect my ticket after booking online?",
      answer:
        "After successful reservation, you'll receive an e-ticket. You can print it or show the digital copy on your mobile at the station to board the train. Carry a valid ID used during reservation.",
    },
    {
      id: 8,
      question: "What do I do if I miss my train?",
      answer:
        "If you miss your train, you may be able to catch the next one, depending on the type of ticket and seat availability. Contact our customer support for assistance.",
    },
    {
      id: 9,
      question: "Are there discounts available for group bookings?",
      answer:
        "Yes, we offer discounts for group bookings. The criteria may vary, so please check our website or contact customer support for more details.",
    },
    {
      id: 10,
      question: "How can I contact customer support for assistance?",
      answer:
        "You can contact our customer support through the helpline provided on our website or mobile app. We also offer email and live chat support.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">FAQs</h1>
        <p className="text-gray-600 mb-10">
          Find answers to the most common questions about railway reservations.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {railwayReservationFaqs.map((faq, index) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-2xl shadow-sm bg-white transition hover:shadow-md"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center p-5 text-left"
            >
              <span className="font-semibold text-gray-800 text-lg">
                {faq.question}
              </span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-blue-600" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openIndex === index && (
              <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
