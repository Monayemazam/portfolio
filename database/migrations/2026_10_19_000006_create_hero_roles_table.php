<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hero_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hero_content_id')
                ->constrained('hero_content')
                ->onDelete('cascade');
            $table->string('text', 120);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['hero_content_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_roles');
    }
};
