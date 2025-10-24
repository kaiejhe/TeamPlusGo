import fs from "fs";
const path = "src/pages/VerificationSuccess.vue";
let text = fs.readFileSync(path, "utf8");
const target = `          <Alert variant="default">\r\n              <AlertTitle>ø®√‹Œ¥ π”√</AlertTitle>\r\n              <AlertDescription class="space-y-2">`;
if (!text.includes(target)) {
  throw new Error('target not found');
}
text = text.replace(target, `          <Alert variant="default">\r\n              <AlertDescription class="space-y-2">`);
fs.writeFileSync(path, text, "utf8");
