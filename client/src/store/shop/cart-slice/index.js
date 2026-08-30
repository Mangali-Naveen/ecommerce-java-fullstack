import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { buildApiUrl } from "@/config";

const normalizeCartPayload = (cartPayload = {}) => ({
  ...cartPayload,
  items: (cartPayload?.items || []).map((item) => ({
    ...item,
    productId: item.product?.id,
    title: item.product?.title || item.title,
    image: item.product?.image || item.image,
    price: item.product?.price ?? item.price,
    salePrice: item.product?.salePrice ?? item.salePrice,
  })),
});

const initialState = {
  cartItems: {
    items: [],
  },
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await axios.post(
      buildApiUrl("/api/cart/add"),
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await axios.get(
      buildApiUrl(`/api/cart/${userId}`)
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      buildApiUrl(`/api/cart/${userId}/${productId}`)
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      buildApiUrl("/api/cart/update"),
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = {
        items: [],
      };
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = normalizeCartPayload(action.payload?.data);
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = normalizeCartPayload(action.payload?.data);
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = normalizeCartPayload(action.payload?.data);
      })

      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = {
          items: [],
        };
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
