import { prismaBank } from '../src/bankDbClient';
import bcrypt from 'bcrypt';
import { randomUUID } from "crypto"

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  const paytmBank = await prismaBank.user.upsert({
    where: { phoneNumber: BigInt(9898989898) }, 
    update: {},
    create: {
      name: "PaytmBank",
      phoneNumber: BigInt(9898989898),
      email: "paytm@paytmBank.com",
      password: hashedPassword,
      Account: {
        create: {
          accountNumber: BigInt(123456789012),
          balance: BigInt(3200000),
          securityKey: "123456",
        },
      },
    },
  });

  const normalUser = await prismaBank.user.upsert({
    where: { phoneNumber: BigInt(9999999999) },
    update: {},
    create: {
      name: "Prash",
      phoneNumber: BigInt(9999999999),
      email: "prash@gmail.com",
      password: hashedPassword,
      Account: {
        create: {
          accountNumber: BigInt(987654321012),
          balance: BigInt(50000),
          securityKey: "654321",
        },
      },
    },
  });
  await prismaBank.transactions.create({
    data: {
      senderId: normalUser.id,
      receiverId: paytmBank.id,
      token: randomUUID(),
      amount:BigInt(4000),
      transactionId: "TXN123456",
      status: "Success",
    },
  });

  console.log("Seeded Paytm Bank and user successfully!");
}

main()
  .then(() => {
    console.log("Seeding complete.");
    return prismaBank.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaBank.$disconnect();
    process.exit(1);
  });
