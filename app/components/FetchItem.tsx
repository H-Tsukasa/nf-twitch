"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/apiClient";
import { Item } from "@/types/fastapi";

interface Props {
    itemId: number;
}

const FetchItem = ({ itemId }: Props) => {
    const [item, setItem] = useState<Item | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get<Item>(`/items/${itemId}`);
                setItem(response.data);
            } catch (err) {
                setError("データの取得に失敗しました。");
            }
        };

        fetchData();
    }, [itemId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!item) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>アイテムID: {item.item_id}</h2>
            <p>クエリ: {item.q || "なし"}</p>
        </div>
    );
};

export default FetchItem;
