use wasm_bindgen::prelude::*;

// A simple exported function for demonstration.
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
