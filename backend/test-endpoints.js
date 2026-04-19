async function test() {
  try {
    const res = await fetch('http://localhost:1000/api/auth/profile');
    const text = await res.text();
    console.log("PROFILE RESULT:", res.status, text);

    const res2 = await fetch('http://localhost:1000/api/problems');
    const text2 = await res2.text();
    console.log("PROBLEMS RESULT:", res2.status, text2);
  } catch (err) {
    console.error("FETCH ERROR:", err.message);
  }
}
test();
