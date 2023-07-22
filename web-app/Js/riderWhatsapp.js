// const apiKey = '<4PSEy9bNrxSZhUSmNSVQk8G1blci0CkK6YQI>';

var mb = new MessageBird('4PSEy9bNrxSZhUSmNSVQk8G1blci0CkK6YQI');

var createWhatsAppGroup = function(riderPhoneNumber, userPhoneNumbers) {
  var response = mb.conversations.create({
    friendlyName: `Ride with ${riderPhoneNumber}`,
    participants: userPhoneNumbers,
  });

  console.log(`Successfully created WhatsApp group ${response.sid}`);
};

var riderPhoneNumber = '+923165279744';
var userPhoneNumbers = ['+923330332023'];

// twilio,ultramsg,messegebirt,infobip,sinch