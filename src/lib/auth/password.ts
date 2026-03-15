import { hash, verify } from "@node-rs/argon2";

const ARGON_OPTIONS = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
};

export async function hashPassword(value: string) {
  return hash(value, ARGON_OPTIONS);
}

export async function verifyPassword(hashValue: string, plainText: string) {
  return verify(hashValue, plainText, ARGON_OPTIONS);
}
